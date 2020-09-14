"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoWorkingReviewController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let CoWorkingReviewController = class CoWorkingReviewController {
    constructor(coWorkingRepository) {
        this.coWorkingRepository = coWorkingRepository;
    }
    async find(id, filter) {
        return this.coWorkingRepository.reviews(id).find(filter);
    }
    async create(id, review) {
        return this.coWorkingRepository.reviews(id).create(review);
    }
    async patch(id, review, where) {
        return this.coWorkingRepository.reviews(id).patch(review, where);
    }
    async delete(id, where) {
        return this.coWorkingRepository.reviews(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.get('/co-workings/{id}/reviews', {
        responses: {
            '200': {
                description: 'Array of CoWorking has many Review',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Review) },
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
], CoWorkingReviewController.prototype, "find", null);
tslib_1.__decorate([
    rest_1.post('/co-workings/{id}/reviews', {
        responses: {
            '200': {
                description: 'CoWorking model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.Review) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Review, {
                    title: 'NewReviewInCoWorking',
                    exclude: ['id'],
                    optional: ['coWorkingId']
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingReviewController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.patch('/co-workings/{id}/reviews', {
        responses: {
            '200': {
                description: 'CoWorking.Review PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Review, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Review))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingReviewController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/co-workings/{id}/reviews', {
        responses: {
            '200': {
                description: 'CoWorking.Review DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Review))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingReviewController.prototype, "delete", null);
CoWorkingReviewController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.CoWorkingRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CoWorkingRepository])
], CoWorkingReviewController);
exports.CoWorkingReviewController = CoWorkingReviewController;
//# sourceMappingURL=co-working-review.controller.js.map