"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthorization = void 0;
const tslib_1 = require("tslib");
const authorization_1 = require("@loopback/authorization");
const security_1 = require("@loopback/security");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
async function basicAuthorization(authorizationCtx, metadata) {
    // No access if authorization details are missing
    let currentUser;
    console.log(authorizationCtx.principals[0].profile);
    if (authorizationCtx.principals.length > 0) {
        const user = lodash_1.default.pick(authorizationCtx.principals[0].profile, [
            'id',
            'fullname',
            'role',
        ]);
        currentUser = {
            [security_1.securityId]: user.id,
            fullname: user.fullname,
            roles: user.role,
        };
    }
    else {
        return authorization_1.AuthorizationDecision.DENY;
    }
    if (!currentUser.roles || currentUser.roles.length === 0) {
        return authorization_1.AuthorizationDecision.DENY;
    }
    // Authorize everything that does not have a allowedRoles property
    if (!metadata.allowedRoles || metadata.allowedRoles.length === 0) {
        return authorization_1.AuthorizationDecision.ALLOW;
    }
    const allowed = metadata.allowedRoles.filter(item => currentUser.roles.indexOf(item) !== -1);
    console.log(allowed);
    if (allowed) {
        return authorization_1.AuthorizationDecision.ALLOW;
    }
    return authorization_1.AuthorizationDecision.DENY;
}
exports.basicAuthorization = basicAuthorization;
//# sourceMappingURL=basic-authentication.js.map