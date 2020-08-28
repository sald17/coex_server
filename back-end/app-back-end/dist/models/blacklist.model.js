"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blacklist = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const token_model_1 = require("./token.model");
let Blacklist = class Blacklist extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property.array(token_model_1.Token),
    tslib_1.__metadata("design:type", Array)
], Blacklist.prototype, "list", void 0);
Blacklist = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Blacklist);
exports.Blacklist = Blacklist;
//# sourceMappingURL=blacklist.model.js.map