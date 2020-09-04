import {
    AuthorizationContext,
    AuthorizationDecision,
    AuthorizationMetadata,
} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function basicAuthorization(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
    // No access if authorization details are missing
    let currentUser: UserProfile;
    if (authorizationCtx.principals.length > 0) {
        const user = _.pick(authorizationCtx.principals[0].profile, [
            'id',
            'fullname',
            'role',
        ]);
        currentUser = {
            [securityId]: user.id,
            fullname: user.fullname,
            roles: user.role,
        };
    } else {
        return AuthorizationDecision.DENY;
    }

    if (!currentUser.roles || currentUser.roles.length === 0) {
        return AuthorizationDecision.DENY;
    }

    // Authorize everything that does not have a allowedRoles property
    if (!metadata.allowedRoles || metadata.allowedRoles.length === 0) {
        return AuthorizationDecision.ALLOW;
    }

    const allowed = metadata.allowedRoles.filter(
        item => currentUser.roles.indexOf(item) !== -1,
    );

    if (!allowed || allowed.length === 0) {
        return AuthorizationDecision.DENY;
    }

    return AuthorizationDecision.ALLOW;
}
