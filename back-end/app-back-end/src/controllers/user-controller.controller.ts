// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
    get,
    HttpErrors,
    param,
    post,
    Request,
    requestBody,
    RequestWithSession,
    Response,
    RestBindings,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {RequestHandler} from 'express';
import {
    EmailServiceBindings,
    FILE_UPLOAD_SERVICE,
    JwtServiceBindings,
    PasswordHasherBindings,
} from '../config/key';
import {ThirdPartyIdentityRepository, UserRepository} from '../repositories';
import {EmailService} from '../services/email.service';
import {FileUploadProvider} from '../services/file-upload';
import {JwtService} from '../services/jwt.service';
import {PasswordHasherService} from '../services/password-hasher.service';

// import {inject} from '@loopback/core';

export class UserControllerController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(ThirdPartyIdentityRepository)
        public thirdPartyRepository: ThirdPartyIdentityRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasherService,
        @inject(JwtServiceBindings.TOKEN_SERVICE)
        public jwtService: JwtService,
        @inject(EmailServiceBindings.EMAIL_SERVICE)
        public emailService: EmailService,
        @inject(FILE_UPLOAD_SERVICE)
        public uploadFileService: RequestHandler,
    ) {}

    @authenticate('jwt')
    @get('/users')
    async getUser(@inject(SecurityBindings.USER) userProfile: UserProfile) {
        return await this.userRepository.find({
            include: [
                {
                    relation: 'identities',
                },
            ],
        });
    }

    @post('/files', {
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                        },
                    },
                },
                description: 'Files and fields',
            },
        },
    })
    async fileUpload(
        @requestBody.file()
        request: Request,
        @inject(RestBindings.Http.RESPONSE) response: Response,
    ): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            this.uploadFileService(request, response, (err: unknown) => {
                if (err) reject(err);
                else {
                    resolve(FileUploadProvider.getFilesAndFields(request));
                }
            });
        });
    }

    @post('/user/sign-up')
    async signup(@requestBody() user: any) {
        console.log(user);
        const isExisted = await this.userRepository.findOne({
            where: {
                email: user.email,
            },
        });

        if (isExisted) {
            throw new HttpErrors.BadRequest('Email is already registered.');
            return;
        }

        user.password = await this.passwordHasher.hashPassword(user.password);

        const newUser = await this.userRepository.create(user);
        if (!newUser) {
            throw new HttpErrors.BadRequest('Error in registering. Try again');
            return;
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
        await this.emailService.sendVerificationEmail(
            newUser.email,
            verifiedToken,
        );
        return {messgage: 'Created successfully'};
    }

    @authenticate('local')
    @post('/user/log-in')
    async login(
        @requestBody() user: any,
        @inject(SecurityBindings.USER) userProfile: UserProfile,
        @inject(RestBindings.Http.REQUEST) request: RequestWithSession,
        @inject(RestBindings.Http.RESPONSE) response: Response,
    ) {
        delete userProfile.profile.password;
        let token = await this.jwtService.generateToken(userProfile);

        return {token};
    }

    @get('/user/verification/{verifyToken}')
    async verifyEmail(@param.path.string('verifyToken') verifyToken: string) {
        const verified = await this.jwtService.verifyToken(verifyToken);

        if (!verified) {
            throw new HttpErrors.BadRequest();
            return;
        }

        this.userRepository.updateById(verified.profile.id, {
            emailVerified: true,
        });

        return 'Email is verified';
    }
}
