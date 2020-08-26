"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProfile = void 0;
const security_1 = require("@loopback/security");
exports.mapProfile = (user) => {
    return {
        [security_1.securityId]: user.id + '',
        profile: { ...user },
    };
};
//# sourceMappingURL=types.js.map