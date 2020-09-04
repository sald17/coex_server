"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomServiceController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let RoomServiceController = class RoomServiceController {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async get(id, filter) {
        return this.roomRepository.service(id).get(filter);
    }
    async create(id, service) {
        return this.roomRepository.service(id).create(service);
    }
    async patch(id, service, where) {
        return this.roomRepository.service(id).patch(service, where);
    }
    async delete(id, where) {
        return this.roomRepository.service(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.get('/rooms/{id}/service', {
        responses: {
            '200': {
                description: 'Room has one Service',
                content: {
                    'application/json': {
                        schema: rest_1.getModelSchemaRef(models_1.Service),
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
], RoomServiceController.prototype, "get", null);
tslib_1.__decorate([
    rest_1.post('/rooms/{id}/service', {
        responses: {
            '200': {
                description: 'Room model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.Service) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Service, {
                    title: 'NewServiceInRoom',
                    exclude: ['id'],
                    optional: ['roomId']
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomServiceController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.patch('/rooms/{id}/service', {
        responses: {
            '200': {
                description: 'Room.Service PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Service, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Service))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomServiceController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/rooms/{id}/service', {
        responses: {
            '200': {
                description: 'Room.Service DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Service))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomServiceController.prototype, "delete", null);
RoomServiceController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.RoomRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.RoomRepository])
], RoomServiceController);
exports.RoomServiceController = RoomServiceController;
//# sourceMappingURL=room-service.controller.js.map