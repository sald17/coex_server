// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject, intercept} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, HttpErrors, param, post, put, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {UserAccountInterceptor} from '../access-control/interceptor/user-account-interceptor';
import {
    EmailServiceBindings,
    JwtServiceBindings,
    PasswordHasherBindings,
} from '../config/key';
import {BlacklistRepository, UserRepository} from '../repositories';
import {EmailService} from '../services/email.service';
import {JwtService} from '../services/jwt.service';
import {PasswordHasherService} from '../services/password-hasher.service';
import {mapProfile} from '../services/user.service';
// import {inject} from '@loopback/core';

@intercept(UserAccountInterceptor.BINDING_KEY)
export class UserControllerController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(BlacklistRepository) public blacklist: BlacklistRepository,
        @inject(SecurityBindings.USER, {optional: true})
        private user: UserProfile,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasherService,
        @inject(JwtServiceBindings.TOKEN_SERVICE)
        public jwtService: JwtService,
        @inject(EmailServiceBindings.EMAIL_SERVICE)
        public emailService: EmailService,
    ) {}

    // User sign up
    @post('/user/sign-up/{role}', {
        responses: {
            '200': {
                description: 'Register',
                content: {
                    'application/json': {
                        message:
                            'Registered successfully, check your email to verified',
                    },
                },
            },
        },
    })
    async signup(
        @requestBody() user: any,
        @param.path.string('role') role: string,
    ) {
        //Check email existed
        const isExisted = await this.userRepository.findOne({
            where: {
                email: user.email,
            },
        });

        if (isExisted) {
            throw new HttpErrors.BadRequest('Email is already registered.');
        }

        user.password = await this.passwordHasher.hashPassword(user.password);
        user.role = [role];
        const newUser = await this.userRepository.create(user);
        if (!newUser) {
            throw new HttpErrors.BadRequest('Error in registering. Try again');
        }

        //Generate verified token
        const userProfile: UserProfile = Object.assign({
            profile: {
                [securityId]: newUser.id,
                email: newUser.email,
                id: newUser.id,
            },
        });

        let verifiedToken: string = await this.jwtService.generateToken(
            userProfile,
            10 * 60, //10 minutes
        );
        let sentEmail = await this.emailService.sendVerificationEmail(
            newUser.email,
            verifiedToken,
        );
        if (sentEmail.error) {
            await this.userRepository.delete(newUser);
            throw new HttpErrors.BadRequest(
                'You must register with valid email.',
            );
        }
        return {message: 'Created successfully'};
    }

    /**
     *  User log in
     *
     *  return an access token
     *
     */

    @post('/user/log-in/{role}')
    async login(
        @param.path.string('role') role: string,
        @requestBody()
        credential: any,
    ) {
        //Check firebase token
        if (!credential.firebaseToken) {
            throw new HttpErrors.Unauthorized('Missing credentials');
        }
        // Check user & password
        const user = await this.userRepository.findOne({
            where: {
                email: credential.email,
            },
        });
        if (!user) {
            throw new HttpErrors.Unauthorized('Incorrect email or password');
        }
        if (
            !(await this.passwordHasher.comparePassword(
                credential.password,
                user.password,
            ))
        ) {
            throw new HttpErrors.Unauthorized('Incorrect email or password');
        }
        //check role
        const userProfile: UserProfile = mapProfile(user);
        if (role === 'client' || role === 'host') {
            if (!userProfile.profile.role.includes(role)) {
                user.role.push(role);
            }
        } else {
            throw new HttpErrors.NotFound();
        }

        // Generate token
        const profile = {
            [securityId]: userProfile[securityId],
            profile: {
                id: userProfile.profile.id,
                fullname: userProfile.profile.fullname,
                role: userProfile.profile.role,
            },
        };
        let token = await this.jwtService.generateToken(
            profile,
            Date.now() + 3600 * 24 * 365,
        );
        user.token.push(token);
        user.firebaseToken.push(credential.firebaseToken);
        await this.userRepository.update(user);
        return {token};
    }

    // Verify email
    @get('/user/verification/{verifyToken}')
    async verifyEmail(@param.path.string('verifyToken') verifyToken: string) {
        const verified = await this.jwtService.verifyToken(verifyToken);
        console.log(verified);
        if (!verified) {
            throw new HttpErrors.BadRequest(`Outdated token.`);
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

    @authenticate('jwt')
    @post('/user/logout', {
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
    })
    async logout() {
        const user = await this.userRepository.findById(this.user.profile.id);
        const index = user.token.indexOf(this.user.profile.token);
        if (index !== -1) {
            user.token.splice(index, 1);
        }
        this.userRepository.update(user);
        const storeValue = this.passwordHasher.getStoreValue(this.user);
        await this.blacklist.addToken(storeValue);
        return {message: 'Logged out'};
    }
    /**
     * Thay doi mat khau
     *
     */

    @authenticate('jwt')
    @put('/user/change-password')
    async changePassword(@requestBody() userCredential: any) {
        const user = await this.userRepository.findById(this.user.profile.id);
        if (!user) {
            throw new HttpErrors.Unauthorized('Not found user');
        }
        const isCorrectPass = await this.passwordHasher.comparePassword(
            userCredential.oldPass,
            user.password,
        );
        if (!isCorrectPass) {
            throw new HttpErrors.BadRequest('Invalid password');
        }
        await this.userRepository.updateById(this.user.profile.id, {
            password: await this.passwordHasher.hashPassword(
                userCredential.newPass,
            ),
        });
        return {
            message: 'Change successfully.',
        };
    }

    /**
     * Quen mat khau
     */

    @post('/user/forgot-password')
    async forgotPassword(@requestBody() body: any) {
        const {email} = body;
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new HttpErrors.NotFound('Not found user');
        }

        const otp = await this.passwordHasher.generateOTP();
        await this.blacklist.addOtp(email, otp);
        const info = await this.emailService.sendOTPEmail(email, otp);
        if (!info) {
            throw new HttpErrors.GatewayTimeout();
        }

        return {message: 'Check your email for OTP'};
    }

    /**
     *  Reset mat khau sau khi bam nut quen mat khau
     *
     */

    @put('/user/reset-password')
    async resetPassword(@requestBody() body: any) {
        const {email, otp, newPass} = body;
        const isValid = this.blacklist.checkOtp(email, otp);
        if (!isValid) {
            throw new HttpErrors.BadRequest('Invalid OTP');
        }
        const password = await this.passwordHasher.hashPassword(newPass);
        await this.userRepository.updateAll(
            {
                password: password,
            },
            {
                email,
            },
        );
        const res = await this.blacklist.deleteOtp(email);
        if (!res) {
            throw new HttpErrors.BadRequest('Invalid OTP code');
        }
        return {message: 'Reset password successfully.'};
    }
}
