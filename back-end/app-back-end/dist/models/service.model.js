"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const room_model_1 = require("./room.model");
let Service = class Service extends repository_1.Entity {
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
], Service.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Service.prototype, "wifi", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Service.prototype, "conversionCall", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Service.prototype, "drink", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Service.prototype, "printer", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Service.prototype, "airCondition", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'array',
        itemType: 'string',
    }),
    tslib_1.__metadata("design:type", Array)
], Service.prototype, "other", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => room_model_1.Room),
    tslib_1.__metadata("design:type", String)
], Service.prototype, "roomId", void 0);
Service = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Service);
exports.Service = Service;
//# sourceMappingURL=service.model.js.map