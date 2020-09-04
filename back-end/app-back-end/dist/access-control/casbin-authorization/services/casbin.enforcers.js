"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-access-control-migration
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnforcerByRole = exports.getCasbinEnforcerByName = void 0;
const tslib_1 = require("tslib");
const casbin = tslib_1.__importStar(require("casbin"));
const path_1 = tslib_1.__importDefault(require("path"));
const POLICY_PATHS = {
    admin: './../../../../fixtures/casbin/rbac_policy.admin.csv',
    owner: './../../../../fixtures/casbin/rbac_policy.owner.csv',
    team: './../../../../fixtures/casbin/rbac_policy.team_member.csv',
};
async function getCasbinEnforcerByName(name) {
    const CASBIN_ENFORCERS = {
        admin: createEnforcerByRole(POLICY_PATHS.admin),
        owner: createEnforcerByRole(POLICY_PATHS.owner),
        team: createEnforcerByRole(POLICY_PATHS.team),
    };
    if (Object.prototype.hasOwnProperty.call(CASBIN_ENFORCERS, name))
        return CASBIN_ENFORCERS[name];
    return undefined;
}
exports.getCasbinEnforcerByName = getCasbinEnforcerByName;
async function createEnforcerByRole(policyPath) {
    const conf = path_1.default.resolve(__dirname, './../../../../fixtures/casbin/rbac_model.conf');
    const policy = path_1.default.resolve(__dirname, policyPath);
    return casbin.newEnforcer(conf, policy);
}
exports.createEnforcerByRole = createEnforcerByRole;
//# sourceMappingURL=casbin.enforcers.js.map