"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoomController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let UserRoomController = class UserRoomController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async find(id, filter) {
        return this.userRepository.bookings(id).find(filter);
    }
    async create(id, room) {
        return this.userRepository.bookings(id).create(room);
    }
    async patch(id, room, where) {
        return this.userRepository.bookings(id).patch(room, where);
    }
    async delete(id, where) {
        return this.userRepository.bookings(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.get('/users/{id}/rooms', {
        responses: {
            '200': {
                description: 'Array of User has many Room through Booking',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Room) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('filter')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserRoomController.prototype, "find", null);
tslib_1.__decorate([
    rest_1.post('/users/{id}/rooms', {
        responses: {
            '200': {
                description: 'create a Room model instance',
                content: {
                    'application/json': { schema: rest_1.getModelSchemaRef(models_1.Room) },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Room, {
                    title: 'NewRoomInUser',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserRoomController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.patch('/users/{id}/rooms', {
        responses: {
            '200': {
                description: 'User.Room PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Room, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Room))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserRoomController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/users/{id}/rooms', {
        responses: {
            '200': {
                description: 'User.Room DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Room))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserRoomController.prototype, "delete", null);
UserRoomController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository])
], UserRoomController);
exports.UserRoomController = UserRoomController;
//# sourceMappingURL=user-room.controller.js.map