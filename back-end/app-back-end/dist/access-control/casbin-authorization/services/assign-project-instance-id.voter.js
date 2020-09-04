"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-access-control-migration
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignProjectInstanceId = void 0;
const authorization_1 = require("@loopback/authorization");
const key_1 = require("../../../config/key");
/**
 * Instance level authorizer for known endpoints
 * - 'projects/{id}/show-balance'
 * - 'projects/{id}/donate'
 * - 'projects/{id}/withdraw'
 * This function is used to modify the authorization context.
 * It is not used for making a decision, so just returns ABSTAIN
 * @param authorizationCtx
 * @param metadata
 */
async function assignProjectInstanceId(authorizationCtx, metadata) {
    var _a;
    const projectId = authorizationCtx.invocationContext.args[0];
    const resourceId = getResourceName((_a = metadata.resource) !== null && _a !== void 0 ? _a : authorizationCtx.resource, projectId);
    // resourceId will override the resource name from metadata
    authorizationCtx.invocationContext.bind(key_1.RESOURCE_ID).to(resourceId);
    return authorization_1.AuthorizationDecision.ABSTAIN;
}
exports.assignProjectInstanceId = assignProjectInstanceId;
/**
 * Generate the resource name according to the naming convention
 * in casbin policy
 * @param resource resource name
 * @param id resource instance's id
 */
function getResourceName(resource, id) {
    // instance level name
    if (id)
        return `${resource}${id}`;
    // class level name
    return `${resource}*`;
}
//# sourceMappingURL=assign-project-instance-id.voter.js.map