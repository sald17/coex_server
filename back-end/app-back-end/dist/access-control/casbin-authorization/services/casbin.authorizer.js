"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-access-control-migration
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinAuthorizationProvider = void 0;
const tslib_1 = require("tslib");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const key_1 = require("../../../config/key");
const debug = require('debug')('loopback:example:acl');
const DEFAULT_SCOPE = 'execute';
// Class level authorizer
let CasbinAuthorizationProvider = class CasbinAuthorizationProvider {
    constructor(enforcerFactory) {
        this.enforcerFactory = enforcerFactory;
    }
    /**
     * @returns authenticateFn
     */
    value() {
        return this.authorize.bind(this);
    }
    async authorize(authorizationCtx, metadata) {
        var _a, _b, _c;
        const subject = this.getUserName(authorizationCtx.principals[0].id);
        const resourceId = await authorizationCtx.invocationContext.get(key_1.RESOURCE_ID, { optional: true });
        const object = (_a = resourceId !== null && resourceId !== void 0 ? resourceId : metadata.resource) !== null && _a !== void 0 ? _a : authorizationCtx.resource;
        const request = {
            subject,
            object,
            action: (_c = (_b = metadata.scopes) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : DEFAULT_SCOPE,
        };
        const allowedRoles = metadata.allowedRoles;
        if (!allowedRoles)
            return authorization_1.AuthorizationDecision.ALLOW;
        if (allowedRoles.length < 1)
            return authorization_1.AuthorizationDecision.DENY;
        let allow = false;
        // An optimization for ONLY searching among the allowed roles' policies
        for (const role of allowedRoles) {
            const enforcer = await this.enforcerFactory(role);
            const allowedByRole = await enforcer.enforce(request.subject, request.object, request.action);
            debug(`authorizer role: ${role}, result: ${allowedByRole}`);
            if (allowedByRole) {
                allow = true;
                break;
            }
        }
        debug('final result: ', allow);
        if (allow)
            return authorization_1.AuthorizationDecision.ALLOW;
        else if (allow === false)
            return authorization_1.AuthorizationDecision.DENY;
        return authorization_1.AuthorizationDecision.ABSTAIN;
    }
    // Generate the user name according to the naming convention
    // in casbin policy
    // A user's name would be `u${id}`
    getUserName(id) {
        return `u${id}`;
    }
};
CasbinAuthorizationProvider = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('casbin.enforcer.factory')),
    tslib_1.__metadata("design:paramtypes", [Function])
], CasbinAuthorizationProvider);
exports.CasbinAuthorizationProvider = CasbinAuthorizationProvider;
//# sourceMappingURL=casbin.authorizer.js.map