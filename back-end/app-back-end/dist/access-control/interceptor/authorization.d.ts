import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from '@loopback/authorization';
import { Provider } from '@loopback/core';
export declare class AuthorizationProvider implements Provider<Authorizer> {
    static readonly BINDING_KEY = "authorizationProviders.my-provider";
    /**
     * @returns an authorizer function
     *
     */
    value(): Authorizer;
    authorize(context: AuthorizationContext, metadata: AuthorizationMetadata): Promise<AuthorizationDecision.ALLOW | AuthorizationDecision.DENY>;
}
