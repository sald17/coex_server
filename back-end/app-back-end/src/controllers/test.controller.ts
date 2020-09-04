// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
    get,
    param,
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {RequestHandler} from 'express';
import {} from 'util';
import {basicAuthorization} from '../access-control/authenticator/basic-authentication';
import {
    EmailServiceBindings,
    FILE_UPLOAD_SERVICE,
    JwtServiceBindings,
} from '../config/key';
import {BlacklistRepository} from '../repositories';
import {JwtService} from '../services';
import {EmailService} from '../services/email.service';
import {FileUploadProvider} from '../services/file-upload';
// import {inject} from '@loopback/core';

export class TestController {
    constructor(
        @repository(BlacklistRepository)
        private blacklist: BlacklistRepository,
        @inject(EmailServiceBindings.EMAIL_SERVICE)
        private emailService: EmailService,
        @inject(FILE_UPLOAD_SERVICE)
        private uploadFileService: RequestHandler,
        @inject(JwtServiceBindings.TOKEN_SERVICE)
        private jwtService: JwtService,
    ) {}

    @get('/test/email')
    async sendEmail() {
        const res = await this.emailService.sendEmail('pcom', 'test Email');
        return res;
    }

    @get('/test/jwt/{string}')
    async generateToken(@param.path.string('string') value: string) {
        const userProfile: UserProfile = {
            [securityId]: '1234',
            profile: {data: value},
        };

        const res = await this.jwtService.generateToken(userProfile);
        return res;
    }

    @get('/test/redis/{token}')
    async testRedis(@param.path.string('token') token: string) {
        // this.blacklist.addToken('THisIsMyToken');
        const blacklist = this.blacklist.check(token);
        return blacklist;
    }

    @post('/files')
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

    @authenticate('jwt')
    @authorize({
        allowedRoles: ['client'],
        voters: [basicAuthorization],
    })
    @get('/test/message')
    async testMessage() {
        return 'Jebaited';
    }
}
