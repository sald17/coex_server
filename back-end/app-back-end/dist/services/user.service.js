"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProfile = exports.UserService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const security_1 = require("@loopback/security");
let UserService = class UserService {
    constructor( /* Add @inject to inject parameters */) { }
};
UserService = tslib_1.__decorate([
    core_1.bind({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
exports.mapProfile = (user) => {
    return {
        [security_1.securityId]: user.id + '',
        profile: { ...user },
    };
};
//# sourceMappingURL=user.service.js.map