"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardExchangeCoinController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let CardExchangeCoinController = class CardExchangeCoinController {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }
    async find(id, filter) {
        return this.cardRepository.exchangeCoins(id).find(filter);
    }
    async create(id, exchangeCoin) {
        return this.cardRepository.exchangeCoins(id).create(exchangeCoin);
    }
    async patch(id, exchangeCoin, where) {
        return this.cardRepository.exchangeCoins(id).patch(exchangeCoin, where);
    }
    async delete(id, where) {
        return this.cardRepository.exchangeCoins(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.get('/cards/{id}/exchange-coins', {
        responses: {
            '200': {
                description: 'Array of Card has many ExchangeCoin',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.ExchangeCoin) },
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
], CardExchangeCoinController.prototype, "find", null);
tslib_1.__decorate([
    rest_1.post('/cards/{id}/exchange-coins', {
        responses: {
            '200': {
                description: 'Card model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.ExchangeCoin) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.ExchangeCoin, {
                    title: 'NewExchangeCoinInCard',
                    exclude: ['id'],
                    optional: ['cardId']
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CardExchangeCoinController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.patch('/cards/{id}/exchange-coins', {
        responses: {
            '200': {
                description: 'Card.ExchangeCoin PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.ExchangeCoin, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.ExchangeCoin))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CardExchangeCoinController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/cards/{id}/exchange-coins', {
        responses: {
            '200': {
                description: 'Card.ExchangeCoin DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.ExchangeCoin))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CardExchangeCoinController.prototype, "delete", null);
CardExchangeCoinController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.CardRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CardRepository])
], CardExchangeCoinController);
exports.CardExchangeCoinController = CardExchangeCoinController;
//# sourceMappingURL=card-exchange-coin.controller.js.map