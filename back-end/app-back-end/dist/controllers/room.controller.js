"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const basic_authentication_1 = require("../access-control/authenticator/basic-authentication");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const service_repository_1 = require("../repositories/service.repository");
const file_upload_1 = require("../services/file-upload");
let RoomController = class RoomController {
    constructor(roomRepository, serviceRepository, coWorkingRepository, user) {
        this.roomRepository = roomRepository;
        this.serviceRepository = serviceRepository;
        this.coWorkingRepository = coWorkingRepository;
        this.user = user;
    }
    /**
     * Create room on CoWorking
     * id in URL is coWorkingID
     */
    async create(id, request, response) {
        const cw = await this.coWorkingRepository.findById(id);
        if (this.user[security_1.securityId].localeCompare(cw.userId)) {
            throw new rest_1.HttpErrors.Unauthorized();
        }
        if (!cw) {
            throw new rest_1.HttpErrors.NotFound('Not found CoWorking');
        }
        const req = await file_upload_1.parseRequest(request, response);
        const preService = JSON.parse(req.fields.service);
        const uploadFile = await file_upload_1.saveFiles(req.files);
        if (uploadFile.error) {
            throw new rest_1.HttpErrors.BadRequest(uploadFile.message);
        }
        req.fields.photo = uploadFile;
        const service = new models_1.Service(preService);
        delete req.fields.service;
        const room = new models_1.Room(req.fields);
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
     * Get list of all room
     */
    async find() {
        return this.roomRepository.find({ include: [{ relation: 'service' }] });
    }
    /**
     * Find room by id
     *
     */
    async findById(id) {
        return this.roomRepository.findById(id, {
            include: [{ relation: 'service' }],
        });
    }
    /**
     * Update room by id
     */
    async updateById(id, request, response) {
        const room = await this.roomRepository.findById(id, {
            include: [{ relation: 'coWorking' }],
        });
        if (this.user[security_1.securityId].localeCompare(room.coWorking.userId)) {
            throw new rest_1.HttpErrors.Unauthorized();
        }
        if (!room) {
            throw new rest_1.HttpErrors.NotFound('Not found room ');
        }
        const req = await file_upload_1.parseRequest(request, response);
        room.photo = room.photo.filter((img) => {
            if (!req.fields.oldPhoto.includes(img)) {
                file_upload_1.deleteFiles([img]);
                return false;
            }
            return true;
        });
        const newPhoto = await file_upload_1.saveFiles(req.files);
        if (newPhoto.error) {
            throw new rest_1.HttpErrors.BadRequest(newPhoto.message);
        }
        const service = JSON.parse(req.fields.service);
        await this.serviceRepository.updateAll(service, {
            roomId: id,
        });
        delete req.fields.service;
        delete req.fields.oldPhoto;
        delete room.coWorking;
        const updateRoom = new models_1.Room(Object.assign({}, room, req.fields, {
            photo: [...newPhoto, ...room.photo],
            modifiedAt: Date(),
        }));
        await this.roomRepository.update(updateRoom);
    }
    /**
     * Delete room
     */
    async deleteById(id) {
        const room = await this.roomRepository.findById(id, {
            include: [{ relation: 'service' }, { relation: 'coWorking' }],
        });
        if (this.user[security_1.securityId].localeCompare(room.coWorking.userId)) {
            throw new rest_1.HttpErrors.Unauthorized();
        }
        this.serviceRepository.deleteById(room.service.id);
        delete room.service;
        delete room.coWorking;
        file_upload_1.deleteFiles(room.photo);
        await this.roomRepository.delete(room);
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
    tslib_1.__param(1, rest_1.requestBody({
        description: 'Create room',
        required: true,
        content: {
            'multipart/form-data': {
                'x-parser': 'stream',
                schema: {
                    type: 'object',
                    properties: {
                        room: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    })),
    tslib_1.__param(2, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
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
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
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
            'multipart/form-data': {
                'x-parser': 'stream',
                schema: {
                    type: 'object',
                    properties: {
                        room: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    })),
    tslib_1.__param(2, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
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
    tslib_1.__param(3, core_1.inject(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.RoomRepository,
        service_repository_1.ServiceRepository,
        repositories_1.CoWorkingRepository, Object])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map