import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import {Provider} from '@loopback/core';
export class AuthorizationProvider implements Provider<Authorizer> {
    static readonly BINDING_KEY = 'authorizationProviders.my-provider';
    /**
     * @returns an authorizer function
     *
     */
    value(): Authorizer {
      return this.authorize.bind(this);
    }

    async authorize(
      context: AuthorizationContext,
      metadata: AuthorizationMetadata,
    ) {
        console.log("======================");
        console.log(context);
        console.log(metadata);
        if (
            context.resource === 'OrderController.prototype.cancelOrder' &&
            context.principals[0].name === 'user-01'
        ) {
            return AuthorizationDecision.DENY;
        }
        return AuthorizationDecision.ALLOW;
    }
  }
