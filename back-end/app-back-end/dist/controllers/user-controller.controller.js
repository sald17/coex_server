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
const user_account_interceptor_1 = require("../authorization/interceptor/user-account-interceptor");
const key_1 = require("../config/key");
const repositories_1 = require("../repositories");
const email_service_1 = require("../services/email.service");
const jwt_service_1 = require("../services/jwt.service");
const password_hasher_service_1 = require("../services/password-hasher.service");
// import {inject} from '@loopback/core';
let UserControllerController = class UserControllerController {
    constructor(userRepository, thirdPartyRepository, blacklist, user, passwordHasher, jwtService, emailService, uploadFileService) {
        this.userRepository = userRepository;
        this.thirdPartyRepository = thirdPartyRepository;
        this.blacklist = blacklist;
        this.user = user;
        this.passwordHasher = passwordHasher;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.uploadFileService = uploadFileService;
    }
    // User sign up
    async signup(user) {
        const isExisted = await this.userRepository.findOne({
            where: {
                email: user.email,
            },
        });
        if (isExisted) {
            throw new rest_1.HttpErrors.BadRequest('Email is already registered.');
        }
        user.password = await this.passwordHasher.hashPassword(user.password);
        const newUser = await this.userRepository.create(user);
        if (!newUser) {
            throw new rest_1.HttpErrors.BadRequest('Error in registering. Try again');
        }
        const userProfile = Object.assign({
            profile: {
                [security_1.securityId]: newUser.id,
                email: newUser.email,
                username: newUser.username,
                id: newUser.id,
            },
        });
        let verifiedToken = await this.jwtService.generateToken(userProfile, 1000 * 60 * 10);
        let sentEmail = await this.emailService.sendVerificationEmail(newUser.email, verifiedToken);
        if (sentEmail.error) {
            await this.userRepository.delete(newUser);
            throw new rest_1.HttpErrors.BadRequest('You must register with valid email.');
        }
        console.log('asdfqwer');
        return { message: 'Created successfully' };
    }
    // User log in
    async login(user, userProfile, request, response) {
        const profile = {
            [security_1.securityId]: userProfile[security_1.securityId],
            profile: {
                id: userProfile.profile.id,
                fullname: userProfile.profile.fullname,
                role: userProfile.profile.role,
            },
        };
        let token = await this.jwtService.generateToken(profile);
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
        return 'Email is verified';
    }
    async logout() {
        const storeValue = `${this.user.jti}:${this.user.exp}`;
        await this.blacklist.addToken(storeValue);
        return { message: 'Logged out' };
        // console.log(this.user.p);
        // let a = await this.blacklist.set(
        //     this.user.profile.id,
        //     this.user.profile.jti,
        // );
    }
};
tslib_1.__decorate([
    rest_1.post('/user/sign-up', {
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
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "signup", null);
tslib_1.__decorate([
    authentication_1.authenticate('local'),
    rest_1.post('/user/log-in'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__param(1, core_1.inject(security_1.SecurityBindings.USER)),
    tslib_1.__param(2, core_1.inject(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__param(3, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, Object]),
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
UserControllerController = tslib_1.__decorate([
    core_1.intercept(user_account_interceptor_1.UserAccountInterceptor.BINDING_KEY),
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.ThirdPartyIdentityRepository)),
    tslib_1.__param(2, repository_1.repository(repositories_1.BlacklistRepository)),
    tslib_1.__param(3, core_1.inject(security_1.SecurityBindings.USER, { optional: true })),
    tslib_1.__param(4, core_1.inject(key_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__param(5, core_1.inject(key_1.JwtServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(6, core_1.inject(key_1.EmailServiceBindings.EMAIL_SERVICE)),
    tslib_1.__param(7, core_1.inject(key_1.FILE_UPLOAD_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        repositories_1.ThirdPartyIdentityRepository,
        repositories_1.BlacklistRepository, Object, password_hasher_service_1.PasswordHasherService,
        jwt_service_1.JwtService,
        email_service_1.EmailService, Function])
], UserControllerController);
exports.UserControllerController = UserControllerController;
//# sourceMappingURL=user-controller.controller.js.map