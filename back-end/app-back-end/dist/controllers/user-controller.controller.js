"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllerController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const user_account_interceptor_1 = require("../access-control/interceptor/user-account-interceptor");
const key_1 = require("../config/key");
const repositories_1 = require("../repositories");
const email_service_1 = require("../services/email.service");
const jwt_service_1 = require("../services/jwt.service");
const password_hasher_service_1 = require("../services/password-hasher.service");
const user_service_1 = require("../services/user.service");
// import {inject} from '@loopback/core';
let UserControllerController = class UserControllerController {
    constructor(userRepository, blacklist, user, passwordHasher, jwtService, emailService) {
        this.userRepository = userRepository;
        this.blacklist = blacklist;
        this.user = user;
        this.passwordHasher = passwordHasher;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    // User sign up
    async signup(user, role) {
        //Check email existed
        const isExisted = await this.userRepository.findOne({
            where: {
                email: user.email,
            },
        });
        if (isExisted) {
            throw new rest_1.HttpErrors.BadRequest('Email is already registered.');
        }
        user.password = await this.passwordHasher.hashPassword(user.password);
        user.role = [role];
        const newUser = await this.userRepository.create(user);
        if (!newUser) {
            throw new rest_1.HttpErrors.BadRequest('Error in registering. Try again');
        }
        //Generate verified token
        const userProfile = Object.assign({
            profile: {
                [security_1.securityId]: newUser.id,
                email: newUser.email,
                id: newUser.id,
            },
        });
        let verifiedToken = await this.jwtService.generateToken(userProfile, 10 * 60);
        let sentEmail = await this.emailService.sendVerificationEmail(newUser.email, verifiedToken);
        if (sentEmail.error) {
            await this.userRepository.delete(newUser);
            throw new rest_1.HttpErrors.BadRequest('You must register with valid email.');
        }
        return { message: 'Created successfully' };
    }
    /**
     *  User log in
     *
     *  return an access token
     *
     */
    async login(role, credential) {
        //Check firebase token
        if (!credential.firebaseToken) {
            throw new rest_1.HttpErrors.Unauthorized('Missing credentials');
        }
        // Check user & password
        const user = await this.userRepository.findOne({
            where: {
                email: credential.email,
            },
        });
        if (!user) {
            throw new rest_1.HttpErrors.Unauthorized('Incorrect email or password');
        }
        if (!(await this.passwordHasher.comparePassword(credential.password, user.password))) {
            throw new rest_1.HttpErrors.Unauthorized('Incorrect email or password');
        }
        //check role
        const userProfile = user_service_1.mapProfile(user);
        if (role === 'client' || role === 'host') {
            if (!userProfile.profile.role.includes(role)) {
                user.role.push(role);
            }
        }
        else {
            throw new rest_1.HttpErrors.NotFound();
        }
        // Generate token
        const profile = {
            [security_1.securityId]: userProfile[security_1.securityId],
            profile: {
                id: userProfile.profile.id,
                fullname: userProfile.profile.fullname,
                role: userProfile.profile.role,
            },
        };
        let token = await this.jwtService.generateToken(profile, Date.now() + 3600 * 24 * 365);
        user.token.push(token);
        user.firebaseToken.push(credential.firebaseToken);
        await this.userRepository.update(user);
        return { token };
    }
    // Verify email
    async verifyEmail(verifyToken) {
        const verified = await this.jwtService.verifyToken(verifyToken);
        if (!verified) {
            throw new rest_1.HttpErrors.BadRequest(`Outdated token.`);
        }
        await this.userRepository.updateById(verified.profile.id, {
            emailVerified: true,
        });
        const storeValue = `${verified.jti}:${verified.exp}`;
        await this.blacklist.addToken(storeValue);
        return 'Email is verified';
    }
    /**
     * Log out
     */
    async logout() {
        const user = await this.userRepository.findById(this.user.profile.id);
        const index = user.token.indexOf(this.user.profile.token);
        if (index !== -1) {
            user.token.splice(index, 1);
        }
        this.userRepository.update(user);
        const storeValue = this.passwordHasher.getStoreValue(this.user);
        await this.blacklist.addToken(storeValue);
        return { message: 'Logged out' };
    }
    /**
     * Thay doi mat khau
     *
     */
    async changePassword(userCredential) {
        const user = await this.userRepository.findById(this.user.profile.id);
        if (!user) {
            throw new rest_1.HttpErrors.Unauthorized('Not found user');
        }
        const isCorrectPass = await this.passwordHasher.comparePassword(userCredential.oldPass, user.password);
        if (!isCorrectPass) {
            throw new rest_1.HttpErrors.BadRequest('Invalid password');
        }
        await this.userRepository.updateById(this.user.profile.id, {
            password: await this.passwordHasher.hashPassword(userCredential.newPass),
            modifiedAt: Date(),
        });
        return {
            message: 'Change successfully.',
        };
    }
    /**
     * Quen mat khau va gui email cho user
     */
    async forgotPassword(body) {
        const { email } = body;
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new rest_1.HttpErrors.NotFound('Not found user');
        }
        const otp = await this.passwordHasher.generateOTP();
        await this.blacklist.addOtp(email, otp);
        const info = await this.emailService.sendOTPEmail(email, otp);
        if (!info) {
            throw new rest_1.HttpErrors.GatewayTimeout();
        }
        return { message: 'Check your email for OTP' };
    }
    /**
     *  Reset mat khau sau khi bam nut quen mat khau
     *
     */
    async resetPassword(body) {
        const { email, otp, newPass } = body;
        const isValid = this.blacklist.checkOtp(email, otp);
        if (!isValid) {
            throw new rest_1.HttpErrors.BadRequest('Invalid OTP');
        }
        const password = await this.passwordHasher.hashPassword(newPass);
        await this.userRepository.updateAll({
            password: password,
            modifiedAt: Date(),
        }, {
            email,
        });
        const res = await this.blacklist.deleteOtp(email);
        if (!res) {
            throw new rest_1.HttpErrors.BadRequest('Invalid OTP code');
        }
        return { message: 'Reset password successfully.' };
    }
    async getMe() {
        return 'JeBaited';
    }
};
tslib_1.__decorate([
    rest_1.post('/user/sign-up/{role}', {
        responses: {
            '200': {
                description: 'Register',
                content: {
                    'application/json': {
                        message: 'Registered successfully, check your email to verified',
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__param(1, rest_1.param.path.string('role')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "signup", null);
tslib_1.__decorate([
    rest_1.post('/user/log-in/{role}'),
    tslib_1.__param(0, rest_1.param.path.string('role')),
    tslib_1.__param(1, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "login", null);
tslib_1.__decorate([
    rest_1.get('/user/verification/{verifyToken}'),
    tslib_1.__param(0, rest_1.param.path.string('verifyToken')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "verifyEmail", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    rest_1.post('/user/logout', {
        responses: {
            '200': {
                description: 'Logout',
                content: {
                    'application/json': {
                        message: 'Logged out.',
                    },
                },
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "logout", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    rest_1.put('/user/change-password'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "changePassword", null);
tslib_1.__decorate([
    rest_1.post('/user/forgot-password'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "forgotPassword", null);
tslib_1.__decorate([
    rest_1.put('/user/reset-password'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "resetPassword", null);
tslib_1.__decorate([
    rest_1.get('/test'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "getMe", null);
UserControllerController = tslib_1.__decorate([
    core_1.intercept(user_account_interceptor_1.UserAccountInterceptor.BINDING_KEY),
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.BlacklistRepository)),
    tslib_1.__param(2, core_1.inject(security_1.SecurityBindings.USER, { optional: true })),
    tslib_1.__param(3, core_1.inject(key_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__param(4, core_1.inject(key_1.JwtServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(5, core_1.inject(key_1.EmailServiceBindings.EMAIL_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        repositories_1.BlacklistRepository, Object, password_hasher_service_1.PasswordHasherService,
        jwt_service_1.JwtService,
        email_service_1.EmailService])
], UserControllerController);
exports.UserControllerController = UserControllerController;
//# sourceMappingURL=user-controller.controller.js.map