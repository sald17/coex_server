"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationProvider = void 0;
const authorization_1 = require("@loopback/authorization");
class AuthorizationProvider {
    /**
     * @returns an authorizer function
     *
     */
    value() {
        return this.authorize.bind(this);
    }
    async authorize(context, metadata) {
        console.log("======================");
        console.log(context);
        console.log(metadata);
        if (context.resource === 'OrderController.prototype.cancelOrder' &&
            context.principals[0].name === 'user-01') {
            return authorization_1.AuthorizationDecision.DENY;
        }
        return authorization_1.AuthorizationDecision.ALLOW;
    }
}
exports.AuthorizationProvider = AuthorizationProvider;
AuthorizationProvider.BINDING_KEY = 'authorizationProviders.my-provider';
//# sourceMappingURL=authorization.js.map