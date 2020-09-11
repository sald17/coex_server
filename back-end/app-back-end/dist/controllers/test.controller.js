"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const repositories_1 = require("../repositories");
// import {inject} from '@loopback/core';
let TestController = class TestController {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async test() {
        // ScheduleService.agenda.define('test1', async (job: any) => {
        //     console.log('Test1');
        // });
        // ScheduleService.agenda.schedule(
        //     new Date().getTime() + 10 * 1000,
        //     'test1',
        // );
        // ScheduleService.agenda.define('test2', async (job: any) => {
        //     ScheduleService.agenda.cancel({name: 'test1'});
        //     console.log('Test2');
        // });
        // ScheduleService.agenda.schedule(
        //     new Date().getTime() + 5 * 1000,
        //     'test2',
        // );
    }
};
tslib_1.__decorate([
    rest_1.get('/test'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TestController.prototype, "test", null);
TestController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.BookingRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BookingRepository])
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=test.controller.js.map