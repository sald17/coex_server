"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeCoin = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const card_model_1 = require("./card.model");
const user_model_1 = require("./user.model");
let ExchangeCoin = class ExchangeCoin extends repository_1.Entity {
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
], ExchangeCoin.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], ExchangeCoin.prototype, "coin", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], ExchangeCoin.prototype, "hash", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], ExchangeCoin.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => card_model_1.Card),
    tslib_1.__metadata("design:type", String)
], ExchangeCoin.prototype, "cardId", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => user_model_1.User),
    tslib_1.__metadata("design:type", String)
], ExchangeCoin.prototype, "userId", void 0);
ExchangeCoin = tslib_1.__decorate([
    repository_1.model({ settings: { strict: false } }),
    tslib_1.__metadata("design:paramtypes", [Object])
], ExchangeCoin);
exports.ExchangeCoin = ExchangeCoin;
//# sourceMappingURL=exchange-coin.model.js.map