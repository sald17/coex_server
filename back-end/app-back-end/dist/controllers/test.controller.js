"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const key_1 = require("../config/key");
const email_service_1 = require("../services/email.service");
// import {inject} from '@loopback/core';
let TestController = class TestController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async sendEmail() {
        const res = this.emailService.sendEmail('png9981@gmail.com', 'test Email');
        console.log('Controller');
        console.log(res);
    }
};
tslib_1.__decorate([
    rest_1.get('/test/email'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "sendEmail", null);
TestController = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(key_1.EmailServiceBindings.EMAIL_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [email_service_1.EmailService])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.controller.js.map