// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject, intercept} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, HttpErrors, param, post, put, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {UserAccountInterceptor} from '../authorization/interceptor/user-account-interceptor';
import {
    EmailServiceBindings,
    JwtServiceBindings,
    PasswordHasherBindings,
} from '../config/key';
import {
    BlacklistRepository,
    ThirdPartyIdentityRepository,
    UserRepository,
} from '../repositories';
import {EmailService} from '../services/email.service';
import {JwtService} from '../services/jwt.service';
import {PasswordHasherService} from '../services/password-hasher.service';
// import {inject} from '@loopback/core';

@intercept(UserAccountInterceptor.BINDING_KEY)
export class UserControllerController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(ThirdPartyIdentityRepository)
        public thirdPartyRepository: ThirdPartyIdentityRepository,
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
    @post('/user/sign-up', {
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
    async signup(@requestBody() user: any) {
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

    // User log in
    @authenticate('local')
    @post('/user/log-in')
    async login(@inject(SecurityBindings.USER) userProfile: UserProfile) {
        const profile = {
            [securityId]: userProfile[securityId],
            profile: {
                id: userProfile.profile.id,
                fullname: userProfile.profile.fullname,
                role: userProfile.profile.role,
            },
        };
        let token = await this.jwtService.generateToken(profile);
        delete profile.profile.role;
        delete profile.profile.fullname;
        let refreshToken = userProfile.profile.refreshToken;

        if (!refreshToken) {
            refreshToken = await this.jwtService.generateRefreshToken(profile);
            await this.userRepository.updateById(userProfile.profile.id, {
                refreshToken: refreshToken,
            });
        }

        return {token, refreshToken};
    }

    // Verify email
    @get('/user/verification/{verifyToken}')
    async verifyEmail(@param.path.string('verifyToken') verifyToken: string) {
        const verified = await this.jwtService.verifyToken(verifyToken);

        if (!verified) {
            throw new HttpErrors.BadRequest(`Outdated token.`);
        }

        await this.userRepository.updateById(verified.profile.id, {
            emailVerified: true,
        });

        return 'Email is verified';
    }

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
        const storeValue = `${this.user.jti}:${this.user.exp}`;
        await this.blacklist.addToken(storeValue);
        return {message: 'Logged out'};
    }

    @post('/user/refresh')
    async refreshToken(@requestBody() body: any) {
        const {token} = body;
        const decoded = await this.jwtService.verifyToken(token);
        const user = await this.userRepository.findById(decoded.profile.id);
        if (token.localeCompare(user.refreshToken)) {
            throw new HttpErrors.Forbidden(JwtService.INVALID_TOKEN_MESSAGE);
        }
        const profile: UserProfile = {
            [securityId]: user.id + '',
            profile: {
                id: user.id,
                fullname: user.fullname,
                role: user.role,
            },
        };
        const accessToken = await this.jwtService.generateToken(profile);
        delete profile.profile.fullname;
        delete profile.profile.role;
        const newRfrToken = await this.jwtService.generateRefreshToken(profile);
        await this.userRepository.updateById(user.id, {
            refreshToken: newRfrToken,
        });
        return {token: accessToken, refreshToken: newRfrToken};
    }

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
