"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const basic_authentication_1 = require("../access-control/authenticator/basic-authentication");
const key_1 = require("../config/key");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
const email_service_1 = require("../services/email.service");
const file_upload_1 = require("../services/file-upload");
// import {inject} from '@loopback/core';
let TestController = class TestController {
    constructor(blacklist, emailService, uploadFileService, jwtService) {
        this.blacklist = blacklist;
        this.emailService = emailService;
        this.uploadFileService = uploadFileService;
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
    async fileUpload(request, response) {
        return new Promise((resolve, reject) => {
            this.uploadFileService(request, response, (err) => {
                if (err)
                    reject(err);
                else {
                    resolve(file_upload_1.FileUploadProvider.getFilesAndFields(request));
                }
            });
        });
    }
    async testMessage() {
        return 'Jebaited';
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
tslib_1.__decorate([
    rest_1.post('/files'),
    tslib_1.__param(0, rest_1.requestBody.file()),
    tslib_1.__param(1, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "fileUpload", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: ['client'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/test/message'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "testMessage", null);
TestController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.BlacklistRepository)),
    tslib_1.__param(1, core_1.inject(key_1.EmailServiceBindings.EMAIL_SERVICE)),
    tslib_1.__param(2, core_1.inject(key_1.FILE_UPLOAD_SERVICE)),
    tslib_1.__param(3, core_1.inject(key_1.JwtServiceBindings.TOKEN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BlacklistRepository,
        email_service_1.EmailService, Function, services_1.JwtService])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.controller.js.map