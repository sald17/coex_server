// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {get} from '@loopback/rest';
import {} from 'util';
import {EmailServiceBindings} from '../config/key';
import {EmailService} from '../services/email.service';
// import {inject} from '@loopback/core';

export class TestController {
    constructor(
        @inject(EmailServiceBindings.EMAIL_SERVICE)
        public emailService: EmailService,
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
}
