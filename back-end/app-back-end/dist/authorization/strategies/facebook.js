"use strict";
// import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
// import {StrategyAdapter} from '@loopback/authentication-passport';
// import {bind, extensionFor, inject} from '@loopback/core';
// import {RedirectRoute, Request} from '@loopback/rest';
// import {UserProfile} from '@loopback/security';
// import {Strategy} from 'passport-facebook';
// import {PassportAuthenticationServiceBindings} from '../../config/key';
// import {User} from '../../models';
// @bind(
//     asAuthStrategy,
//     extensionFor(PassportAuthenticationServiceBindings.OAUTH2_STRATEGY),
// )
// export class FacebookOAuth2Strategy implements AuthenticationStrategy {
//     name: string = 'oauth2-facebook';
//     protected strategy: StrategyAdapter<User>;
//     constructor(
//         @inject('facebookStrategy') facebookPassportStrategy: Strategy,
//     ) {}
//     async authenticate(request: Request): Promise<UserProfile | RedirectRoute> {
//         return this.strategy.authenticate(request);
//     }
// }
//# sourceMappingURL=facebook.js.map