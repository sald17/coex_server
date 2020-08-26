"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyIdentity = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const user_model_1 = require("./user.model");
let ThirdPartyIdentity = class ThirdPartyIdentity extends repository_1.Entity {
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
], ThirdPartyIdentity.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ThirdPartyIdentity.prototype, "provider", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'object',
    }),
    tslib_1.__metadata("design:type", Object)
], ThirdPartyIdentity.prototype, "profile", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: Date(),
    }),
    tslib_1.__metadata("design:type", String)
], ThirdPartyIdentity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        default: Date(),
    }),
    tslib_1.__metadata("design:type", String)
], ThirdPartyIdentity.prototype, "modifiedAt", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => user_model_1.User, { keyTo: 'id' }),
    tslib_1.__metadata("design:type", String)
], ThirdPartyIdentity.prototype, "userId", void 0);
ThirdPartyIdentity = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ThirdPartyIdentity);
exports.ThirdPartyIdentity = ThirdPartyIdentity;
//# sourceMappingURL=third-party-identity.model.js.map