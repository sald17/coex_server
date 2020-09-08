"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const constants_1 = require("../config/constants");
const room_model_1 = require("./room.model");
const transaction_model_1 = require("./transaction.model");
const user_model_1 = require("./user.model");
let Booking = class Booking extends repository_1.Entity {
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
], Booking.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        default: '',
    }),
    tslib_1.__metadata("design:type", String)
], Booking.prototype, "description", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Booking.prototype, "startTime", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Booking.prototype, "endTime", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        require: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Booking.prototype, "duration", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        required: true,
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Booking.prototype, "numPerson", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        default: constants_1.BookingConstant.PENDING,
    }),
    tslib_1.__metadata("design:type", String)
], Booking.prototype, "status", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], Booking.prototype, "modifiedAt", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => user_model_1.User),
    tslib_1.__metadata("design:type", String)
], Booking.prototype, "userId", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => room_model_1.Room),
    tslib_1.__metadata("design:type", String)
], Booking.prototype, "roomId", void 0);
tslib_1.__decorate([
    repository_1.hasOne(() => transaction_model_1.Transaction),
    tslib_1.__metadata("design:type", transaction_model_1.Transaction)
], Booking.prototype, "transaction", void 0);
Booking = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Booking);
exports.Booking = Booking;
//# sourceMappingURL=booking.model.js.map