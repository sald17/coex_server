"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const key_1 = require("../config/key");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
const email_service_1 = require("../services/email.service");
// import {inject} from '@loopback/core';
let TestController = class TestController {
    constructor(blacklist, emailService, jwtService) {
        this.blacklist = blacklist;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }
    async sendEmail() {
        const res = await this.emailService.sendEmail('pcom', 'test Email');
        return res;
    }
    async generateToken(value) {
        const userProfile = {
            [security_1.securityId]: '1234',
            profile: { data: value },
        };
        const res = await this.jwtService.generateToken(userProfile);
        return res;
    }
    async testRedis(token) {
        // this.blacklist.addToken('THisIsMyToken');
        const blacklist = this.blacklist.check(token);
        return blacklist;
    }
};
tslib_1.__decorate([
    rest_1.get('/test/email'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "sendEmail", null);
tslib_1.__decorate([
    rest_1.get('/test/jwt/{string}'),
    tslib_1.__param(0, rest_1.param.path.string('string')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "generateToken", null);
tslib_1.__decorate([
    rest_1.get('/test/redis/{token}'),
    tslib_1.__param(0, rest_1.param.path.string('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "testRedis", null);
TestController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.BlacklistRepository)),
    tslib_1.__param(1, core_1.inject(key_1.EmailServiceBindings.EMAIL_SERVICE)),
    tslib_1.__param(2, core_1.inject(key_1.JwtServiceBindings.TOKEN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BlacklistRepository,
        email_service_1.EmailService,
        services_1.JwtService])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.controller.js.map