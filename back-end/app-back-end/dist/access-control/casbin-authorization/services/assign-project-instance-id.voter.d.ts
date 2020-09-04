import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata } from '@loopback/authorization';
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
export declare function assignProjectInstanceId(authorizationCtx: AuthorizationContext, metadata: AuthorizationMetadata): Promise<AuthorizationDecision>;
