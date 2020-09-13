"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCardController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let UserCardController = class UserCardController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async find(id, filter) {
        return this.userRepository.cards(id).find(filter);
    }
    async create(id, card) {
        return this.userRepository.cards(id).create(card);
    }
    async patch(id, card, where) {
        return this.userRepository.cards(id).patch(card, where);
    }
    async delete(id, where) {
        return this.userRepository.cards(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.get('/users/{id}/cards', {
        responses: {
            '200': {
                description: 'Array of User has many Card',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Card) },
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
], UserCardController.prototype, "find", null);
tslib_1.__decorate([
    rest_1.post('/users/{id}/cards', {
        responses: {
            '200': {
                description: 'User model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.Card) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Card, {
                    title: 'NewCardInUser',
                    exclude: ['id'],
                    optional: ['userId']
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserCardController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.patch('/users/{id}/cards', {
        responses: {
            '200': {
                description: 'User.Card PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Card, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Card))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserCardController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/users/{id}/cards', {
        responses: {
            '200': {
                description: 'User.Card DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Card))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserCardController.prototype, "delete", null);
UserCardController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository])
], UserCardController);
exports.UserCardController = UserCardController;
//# sourceMappingURL=user-card.controller.js.map