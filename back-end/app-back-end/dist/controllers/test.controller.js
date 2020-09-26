"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
// Uncomment these imports to begin using these cool features!
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
// import {inject} from '@loopback/core';
let TestController = class TestController {
    constructor(bookingRepository, userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }
    async test() {
        return 'Jebaited';
    }
    async testNoti() {
        const user = await this.userRepository.findOne({
            where: { email: 'png9981@gmail.com' },
        });
        services_1.Firebase.sendNotification(user.firebaseToken, {
            title: 'Test',
            body: 'Hello',
        });
    }
    async create(request, response) {
        const req = await services_1.parseRequest(request, response);
        console.log(req);
        const uploadFile = await services_1.saveFiles(req.files);
        return uploadFile;
    }
};
tslib_1.__decorate([
    rest_1.get('/test/message'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "test", null);
tslib_1.__decorate([
    rest_1.get('/test/noti'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "testNoti", null);
tslib_1.__decorate([
    rest_1.post('/test/upload'),
    tslib_1.__param(0, rest_1.requestBody({
        description: 'Create coworking',
        required: true,
        content: {
            'multipart/form-data': {
                'x-parser': 'stream',
                schema: {
                    type: 'object',
                    properties: {
                        coworking: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    })),
    tslib_1.__param(1, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "create", null);
TestController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.BookingRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BookingRepository,
        repositories_1.UserRepository])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.controller.js.map