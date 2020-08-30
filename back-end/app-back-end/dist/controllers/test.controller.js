"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const key_1 = require("../config/key");
const email_service_1 = require("../services/email.service");
const file_upload_1 = require("../services/file-upload");
// import {inject} from '@loopback/core';
let TestController = class TestController {
    constructor(emailService, uploadFileService) {
        this.emailService = emailService;
        this.uploadFileService = uploadFileService;
    }
    async sendEmail() {
        const res = this.emailService.sendEmail('png9981@gmail.com', 'test Email');
        console.log('Controller');
        console.log(res);
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
    rest_1.post('/files', {
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
    }),
    tslib_1.__param(0, rest_1.requestBody.file()),
    tslib_1.__param(1, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "fileUpload", null);
tslib_1.__decorate([
    rest_1.get('/test/message'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "testMessage", null);
TestController = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(key_1.EmailServiceBindings.EMAIL_SERVICE)),
    tslib_1.__param(1, core_1.inject(key_1.FILE_UPLOAD_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [email_service_1.EmailService, Function])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.controller.js.map