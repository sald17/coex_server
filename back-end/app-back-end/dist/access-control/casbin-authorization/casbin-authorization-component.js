"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-access-control-migration
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinAuthorizationComponent = void 0;
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const services_1 = require("./services");
class CasbinAuthorizationComponent {
    constructor() {
        this.bindings = [
            core_1.Binding.bind('casbin.enforcer.factory').to(services_1.getCasbinEnforcerByName),
            core_1.Binding.bind('authorizationProviders.casbin-provider')
                .toProvider(services_1.CasbinAuthorizationProvider)
                .tag(authorization_1.AuthorizationTags.AUTHORIZER),
        ];
    }
}
exports.CasbinAuthorizationComponent = CasbinAuthorizationComponent;
//# sourceMappingURL=casbin-authorization-component.js.map