// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {} from 'util';
import {EmailServiceBindings, JwtServiceBindings} from '../config/key';
import {BlacklistRepository} from '../repositories';
import {JwtService} from '../services';
import {EmailService} from '../services/email.service';
// import {inject} from '@loopback/core';

export class TestController {
    constructor(
        @repository(BlacklistRepository)
        private blacklist: BlacklistRepository,
        @inject(EmailServiceBindings.EMAIL_SERVICE)
        private emailService: EmailService,
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
}
