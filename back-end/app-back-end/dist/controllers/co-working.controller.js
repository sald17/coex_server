"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoWorkingController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const basic_authentication_1 = require("../access-control/authenticator/basic-authentication");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let CoWorkingController = class CoWorkingController {
    constructor(coWorkingRepository, userRepository) {
        this.coWorkingRepository = coWorkingRepository;
        this.userRepository = userRepository;
    }
    /**
     * Create CoWorking on user
     * Body type appl/json
     * id in URL is userID
     */
    async create(id, coWorking) {
        const coCreated = await this.coWorkingRepository.findOne({
            where: {
                userId: id,
            },
        });
        if (coCreated) {
            throw new rest_1.HttpErrors.BadRequest('User already register to a CoWorking');
        }
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
    async updateById(id, coWorking) {
        await this.coWorkingRepository.updateById(id, coWorking);
    }
    /**
     * Delete CoWorking by ID
     */
    async deleteById(id) {
        await this.coWorkingRepository.deleteById(id);
    }
    /**
     * Find room of coWorking by ID
     */
    async findRoomOfCoWorking(id) {
        return this.coWorkingRepository
            .rooms(id)
            .find({ include: [{ relation: 'service' }] });
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
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.CoWorking, {
                    title: 'NewCoWorkingInUser',
                    exclude: ['id'],
                    optional: ['userId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
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
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.CoWorking, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.CoWorking]),
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
CoWorkingController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.CoWorkingRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CoWorkingRepository,
        repositories_1.UserRepository])
], CoWorkingController);
exports.CoWorkingController = CoWorkingController;
//# sourceMappingURL=co-working.controller.js.map