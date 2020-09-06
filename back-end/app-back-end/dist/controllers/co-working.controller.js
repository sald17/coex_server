"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoWorkingController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const basic_authentication_1 = require("../access-control/authenticator/basic-authentication");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const file_upload_1 = require("../services/file-upload");
const loopback = require('loopback');
let CoWorkingController = class CoWorkingController {
    constructor(coWorkingRepository, userRepository, roomRepository) {
        this.coWorkingRepository = coWorkingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }
    /**
     * Create CoWorking on user
     * Body type appl/json
     * id in URL is userID
     */
    async create(id, request, response) {
        const coCreated = await this.coWorkingRepository.findOne({
            where: {
                userId: id,
            },
        });
        if (coCreated) {
            throw new rest_1.HttpErrors.BadRequest('User already register to a CoWorking');
        }
        const req = await file_upload_1.parseRequest(request, response);
        const uploadFile = await file_upload_1.saveFiles(req.files);
        if (uploadFile.error) {
            throw new rest_1.HttpErrors.BadRequest(uploadFile.message);
        }
        req.fields.photo = uploadFile;
        const coWorking = new models_1.CoWorking(req.fields);
        // return new CoWorking();
        return this.userRepository.coWorking(id).create(coWorking);
    }
    /**
     * Count num of CoWorking
     */
    async count(where) {
        return this.coWorkingRepository.count(where);
    }
    async find() {
        return this.coWorkingRepository.find({ include: [{ relation: 'user' }] });
    }
    /**
     * Find CoWorking by ID
     */
    async findById(id, filter) {
        return this.coWorkingRepository.findById(id, filter);
    }
    /**
     * Update CoWorking by ID
     */
    async updateById(id, request, response) {
        const coWorking = await this.coWorkingRepository.findById(id);
        if (!coWorking) {
            throw new rest_1.HttpErrors.NotFound('Not found CoWorking');
        }
        const req = await file_upload_1.parseRequest(request, response);
        coWorking.photo = await coWorking.photo.filter(img => {
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
        // coWorking.photo = [...coWorking.photo, ...newPhoto];
        const updateCW = new models_1.CoWorking(Object.assign({}, coWorking, req.fields, {
            photo: [...coWorking.photo, ...newPhoto],
        }));
        await this.coWorkingRepository.update(updateCW);
    }
    /**
     * Delete CoWorking by ID
     */
    async deleteById(id) {
        const coWorking = await this.coWorkingRepository.findById(id, {
            include: [{ relation: 'rooms' }],
        });
        console.log(coWorking);
        if (coWorking.rooms) {
            for (let r of coWorking.rooms) {
                const room = await this.roomRepository.deleteRoom(r.id);
            }
        }
        delete coWorking.rooms;
        file_upload_1.deleteFiles(coWorking.photo);
        await this.coWorkingRepository.delete(coWorking);
        // console.log(coWorking);
    }
    /**
     * Find ROOMS of coWorking by ID
     */
    async findRoomOfCoWorking(id) {
        return this.coWorkingRepository
            .rooms(id)
            .find({ include: [{ relation: 'service' }] });
    }
    /**
     * Find coWorking near me
     *
     */
    async findNearCoWorking(maxDistance, latitude, longitude) {
        if (maxDistance == undefined ||
            maxDistance < 0 ||
            latitude == undefined ||
            longitude == undefined ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180) {
            throw new rest_1.HttpErrors.BadRequest('MissingField');
        }
        const curLocation = new loopback.GeoPoint([latitude, longitude]);
        const filter = {
            where: {
                location: {
                    near: curLocation,
                    maxDistance: maxDistance,
                    unit: 'kilometers',
                },
            },
            include: [
                {
                    relation: 'rooms',
                },
            ],
        };
        const listCoWorking = await this.coWorkingRepository.find(filter);
        return { listCoWorking };
    }
};
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: ['host'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.post('/users/{id}/co-working', {
        responses: {
            '200': {
                description: 'User model instance',
                content: {
                    'application/json': { schema: rest_1.getModelSchemaRef(models_1.CoWorking) },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
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
    tslib_1.__param(2, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingController.prototype, "create", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: [],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/co-workings/count', {
        responses: {
            '200': {
                description: 'CoWorking model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.CoWorking)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingController.prototype, "count", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: [],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/co-workings', {
        responses: {
            '200': {
                description: 'Array of CoWorking model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: rest_1.getModelSchemaRef(models_1.CoWorking, {
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
], CoWorkingController.prototype, "find", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: [],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/co-workings/{id}', {
        responses: {
            '200': {
                description: 'CoWorking model instance',
                content: {
                    'application/json': {
                        schema: rest_1.getModelSchemaRef(models_1.CoWorking, {
                            includeRelations: true,
                        }),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.CoWorking, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingController.prototype, "findById", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: ['host'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.patch('/co-workings/{id}', {
        responses: {
            '204': {
                description: 'CoWorking PATCH success',
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
                        coworking: {
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
], CoWorkingController.prototype, "updateById", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: ['host'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.del('/co-workings/{id}', {
        responses: {
            '204': {
                description: 'CoWorking DELETE success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingController.prototype, "deleteById", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: ['host'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/co-workings/{id}/rooms', {
        responses: {
            '200': {
                description: 'Array of CoWorking has many Room',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Room) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingController.prototype, "findRoomOfCoWorking", null);
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: [],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/co-workings/near'),
    tslib_1.__param(0, rest_1.param.query.number('maxDistance')),
    tslib_1.__param(1, rest_1.param.query.number('latitude')),
    tslib_1.__param(2, rest_1.param.query.number('longitude')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingController.prototype, "findNearCoWorking", null);
CoWorkingController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.CoWorkingRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(2, repository_1.repository(repositories_1.RoomRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CoWorkingRepository,
        repositories_1.UserRepository,
        repositories_1.RoomRepository])
], CoWorkingController);
exports.CoWorkingController = CoWorkingController;
//# sourceMappingURL=co-working.controller.js.map