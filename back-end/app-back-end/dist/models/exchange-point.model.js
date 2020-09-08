"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangePoint = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const transaction_model_1 = require("./transaction.model");
const user_model_1 = require("./user.model");
let ExchangePoint = class ExchangePoint extends repository_1.Entity {
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
], ExchangePoint.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], ExchangePoint.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], ExchangePoint.prototype, "type", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        require: true,
    }),
    tslib_1.__metadata("design:type", Number)
], ExchangePoint.prototype, "point", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => transaction_model_1.Transaction),
    tslib_1.__metadata("design:type", String)
], ExchangePoint.prototype, "transactionId", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => user_model_1.User),
    tslib_1.__metadata("design:type", String)
], ExchangePoint.prototype, "userId", void 0);
ExchangePoint = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ExchangePoint);
exports.ExchangePoint = ExchangePoint;
//# sourceMappingURL=exchange-point.model.js.map