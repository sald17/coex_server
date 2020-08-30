// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {
    get,
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
} from '@loopback/rest';
import {RequestHandler} from 'express';
import {} from 'util';
import {EmailServiceBindings, FILE_UPLOAD_SERVICE} from '../config/key';
import {EmailService} from '../services/email.service';
import {FileUploadProvider} from '../services/file-upload';
// import {inject} from '@loopback/core';

export class TestController {
    constructor(
        @inject(EmailServiceBindings.EMAIL_SERVICE)
        public emailService: EmailService,
        @inject(FILE_UPLOAD_SERVICE)
        public uploadFileService: RequestHandler,
    ) {}

    @get('/test/email')
    async sendEmail() {
        const res = this.emailService.sendEmail(
            'png9981@gmail.com',
            'test Email',
        );
        console.log('Controller');
        console.log(res);
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
}
