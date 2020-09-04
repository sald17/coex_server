"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const service_model_1 = require("./service.model");
let Room = class Room extends repository_1.Entity {
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
], Room.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Room.prototype, "address", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Room.prototype, "about", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], Room.prototype, "price", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], Room.prototype, "maxPerson", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Room.prototype, "coWorkingId", void 0);
tslib_1.__decorate([
    repository_1.hasOne(() => service_model_1.Service),
    tslib_1.__metadata("design:type", service_model_1.Service)
], Room.prototype, "service", void 0);
Room = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Room);
exports.Room = Room;
//# sourceMappingURL=room.model.js.map