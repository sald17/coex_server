"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const basic_authentication_1 = require("../access-control/authenticator/basic-authentication");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const service_repository_1 = require("../repositories/service.repository");
let RoomController = class RoomController {
    constructor(roomRepository, serviceRepository, coWorkingRepository) {
        this.roomRepository = roomRepository;
        this.serviceRepository = serviceRepository;
        this.coWorkingRepository = coWorkingRepository;
    }
    /**
     * Create room on CoWorking
     * id in URL is coWorkingID
     */
    async create(id, room) {
        console.log('object');
        const service = new models_1.Service(room.service);
        delete room.service;
        const newRoom = await this.coWorkingRepository.rooms(id).create(room);
        const newService = await this.roomRepository
            .service(newRoom.id)
            .create(service);
        newRoom.service = newService;
        return newRoom;
    }
    /**
     * Get room count
     */
    async count(where) {
        return this.roomRepository.count(where);
    }
    /**
     * Get list room
     */
    async find() {
        return this.roomRepository.find({ include: [{ relation: 'service' }] });
    }
    /**
     * Find room by id
     *
     */
    async findById(id, filter) {
        return this.roomRepository.findById(id, filter);
    }
    /**
     * Update room by id
     */
    async updateById(id, room) {
        await this.roomRepository.updateById(id, room);
    }
    /**
     * Delete room
     */
    async deleteById(id) {
        await this.roomRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: ['host'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.post('/co-workings/{id}/rooms', {
        responses: {
            '200': {
                description: 'CoWorking model instance',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "create", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: [],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/rooms/count', {
        responses: {
            '200': {
                description: 'Room model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Room)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "count", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: [],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/rooms', {
        responses: {
            '200': {
                description: 'Array of Room model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: rest_1.getModelSchemaRef(models_1.Room, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "find", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: [],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/rooms/{id}', {
        responses: {
            '200': {
                description: 'Room model instance',
                content: {
                    'application/json': {
                        schema: rest_1.getModelSchemaRef(models_1.Room, {
                            includeRelations: true,
                        }),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Room, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "findById", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: ['host'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.patch('/rooms/{id}', {
        responses: {
            '204': {
                description: 'Room PATCH success',
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
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Room]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "updateById", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: ['host'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.del('/rooms/{id}', {
        responses: {
            '204': {
                description: 'Room DELETE success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomController.prototype, "deleteById", null);
RoomController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.RoomRepository)),
    tslib_1.__param(1, repository_1.repository(service_repository_1.ServiceRepository)),
    tslib_1.__param(2, repository_1.repository(repositories_1.CoWorkingRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.RoomRepository,
        service_repository_1.ServiceRepository,
        repositories_1.CoWorkingRepository])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map