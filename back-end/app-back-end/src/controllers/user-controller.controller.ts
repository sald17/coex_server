// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject, intercept} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
    get,
    HttpErrors,
    param,
    post,
    requestBody,
    RequestWithSession,
    Response,
    RestBindings,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {RequestHandler} from 'express';
import {UserAccountInterceptor} from '../authorization/interceptor/user-account-interceptor';
import {
    EmailServiceBindings,
    FILE_UPLOAD_SERVICE,
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
        @inject(FILE_UPLOAD_SERVICE)
        public uploadFileService: RequestHandler,
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

        const userProfile: UserProfile = Object.assign({
            profile: {
                [securityId]: newUser.id,
                email: newUser.email,
                username: newUser.username,
                id: newUser.id,
            },
        });

        let verifiedToken: string = await this.jwtService.generateToken(
            userProfile,
            1000 * 60 * 10,
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
        console.log('asdfqwer');
        return {message: 'Created successfully'};
    }

    // User log in
    @authenticate('local')
    @post('/user/log-in')
    async login(
        @requestBody() user: any,
        @inject(SecurityBindings.USER) userProfile: UserProfile,
        @inject(RestBindings.Http.REQUEST) request: RequestWithSession,
        @inject(RestBindings.Http.RESPONSE) response: Response,
    ) {
        const profile = {
            [securityId]: userProfile[securityId],
            profile: {
                id: userProfile.profile.id,
                fullname: userProfile.profile.fullname,
                role: userProfile.profile.role,
            },
        };
        let token = await this.jwtService.generateToken(profile);

        return {token};
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
        // console.log(this.user.p);
        // let a = await this.blacklist.set(
        //     this.user.profile.id,
        //     this.user.profile.jti,
        // );
    }
}
