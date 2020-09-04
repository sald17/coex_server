import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from '@loopback/authorization';
import { Provider } from '@loopback/core';
import * as casbin from 'casbin';
export declare class CasbinAuthorizationProvider implements Provider<Authorizer> {
    private enforcerFactory;
    constructor(enforcerFactory: (name: string) => Promise<casbin.Enforcer>);
    /**
     * @returns authenticateFn
     */
    value(): Authorizer;
    authorize(authorizationCtx: AuthorizationContext, metadata: AuthorizationMetadata): Promise<AuthorizationDecision>;
    getUserName(id: number): string;
}
