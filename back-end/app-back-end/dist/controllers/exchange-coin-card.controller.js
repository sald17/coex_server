"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeCoinCardController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ExchangeCoinCardController = class ExchangeCoinCardController {
    constructor(exchangeCoinRepository) {
        this.exchangeCoinRepository = exchangeCoinRepository;
    }
    async getCard(id) {
        return this.exchangeCoinRepository.card(id);
    }
};
tslib_1.__decorate([
    rest_1.get('/exchange-coins/{id}/card', {
        responses: {
            '200': {
                description: 'Card belonging to ExchangeCoin',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Card) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ExchangeCoinCardController.prototype, "getCard", null);
ExchangeCoinCardController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.ExchangeCoinRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ExchangeCoinRepository])
], ExchangeCoinCardController);
exports.ExchangeCoinCardController = ExchangeCoinCardController;
//# sourceMappingURL=exchange-coin-card.controller.js.map