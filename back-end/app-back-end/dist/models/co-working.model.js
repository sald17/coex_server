"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoWorking = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const room_model_1 = require("./room.model");
const user_model_1 = require("./user.model");
let CoWorking = class CoWorking extends repository_1.Entity {
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
], CoWorking.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], CoWorking.prototype, "name", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], CoWorking.prototype, "about", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], CoWorking.prototype, "phone", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'array',
        itemType: 'string',
        default: [],
    }),
    tslib_1.__metadata("design:type", Array)
], CoWorking.prototype, "photo", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], CoWorking.prototype, "address", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'array',
        itemType: 'number',
    }),
    tslib_1.__metadata("design:type", Array)
], CoWorking.prototype, "location", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], CoWorking.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], CoWorking.prototype, "modifiedAt", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => user_model_1.User),
    tslib_1.__metadata("design:type", String)
], CoWorking.prototype, "userId", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => room_model_1.Room),
    tslib_1.__metadata("design:type", Array)
], CoWorking.prototype, "rooms", void 0);
CoWorking = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], CoWorking);
exports.CoWorking = CoWorking;
//# sourceMappingURL=co-working.model.js.map