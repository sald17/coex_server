"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Token = class Token extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        id: true,
        generated: false,
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "jti", void 0);
Token = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Token);
exports.Token = Token;
//# sourceMappingURL=token.model.js.map