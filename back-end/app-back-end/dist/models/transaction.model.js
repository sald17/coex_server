"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const booking_model_1 = require("./booking.model");
let Transaction = class Transaction extends repository_1.Entity {
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
], Transaction.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Transaction.prototype, "price", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: new Date(),
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], Transaction.prototype, "modifiedAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        required: true,
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Transaction.prototype, "checkIn", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        default: false,
        required: true,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Transaction.prototype, "checkOut", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], Transaction.prototype, "checkInTime", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], Transaction.prototype, "checkOutTime", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Transaction.prototype, "earnPoint", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Transaction.prototype, "bookingRefernce", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        required: true,
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Transaction.prototype, "payment", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => booking_model_1.Booking, { name: 'booking' }),
    tslib_1.__metadata("design:type", String)
], Transaction.prototype, "bookingId", void 0);
Transaction = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Transaction);
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.model.js.map