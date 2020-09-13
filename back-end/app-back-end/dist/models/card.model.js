"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const exchange_coin_model_1 = require("./exchange-coin.model");
const user_model_1 = require("./user.model");
let Card = class Card extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], Card.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
        unique: true,
    }),
    tslib_1.__metadata("design:type", String)
], Card.prototype, "name", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Card.prototype, "address", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => user_model_1.User),
    tslib_1.__metadata("design:type", String)
], Card.prototype, "userId", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => exchange_coin_model_1.ExchangeCoin),
    tslib_1.__metadata("design:type", Array)
], Card.prototype, "exchangeCoins", void 0);
Card = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Card);
exports.Card = Card;
//# sourceMappingURL=card.model.js.map