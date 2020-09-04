"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCoWorkingController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let UserCoWorkingController = class UserCoWorkingController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async get(id, filter) {
        return this.userRepository.coWorking(id).get(filter);
    }
    async patch(id, coWorking, where) {
        return this.userRepository.coWorking(id).patch(coWorking, where);
    }
    async delete(id, where) {
        return this.userRepository.coWorking(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.get('/users/{id}/co-working', {
        responses: {
            '200': {
                description: 'User has one CoWorking',
                content: {
                    'application/json': {
                        schema: rest_1.getModelSchemaRef(models_1.CoWorking),
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
], UserCoWorkingController.prototype, "get", null);
tslib_1.__decorate([
    rest_1.patch('/users/{id}/co-working', {
        responses: {
            '200': {
                description: 'User.CoWorking PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
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
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.CoWorking))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserCoWorkingController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/users/{id}/co-working', {
        responses: {
            '200': {
                description: 'User.CoWorking DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.CoWorking))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserCoWorkingController.prototype, "delete", null);
UserCoWorkingController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository])
], UserCoWorkingController);
exports.UserCoWorkingController = UserCoWorkingController;
//# sourceMappingURL=user-co-working.controller.js.map