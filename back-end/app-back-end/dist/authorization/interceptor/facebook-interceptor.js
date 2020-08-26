"use strict";
// import {
//     inject,
//     Interceptor,
//     InvocationContext,
//     Next,
//     Provider,
// } from '@loopback/core';
// import {
//     ExpressRequestHandler,
//     RequestContext,
//     RestBindings,
//     toInterceptor,
// } from '@loopback/rest';
// export class FacebookOAuth2Interceptor implements Provider<Interceptor> {
//     constructor(
//         @inject('facebookStrategyMiddleware')
//         public facebookStrategy: ExpressRequestHandler,
//     ) {}
//     value() {
//         return async (invocation: InvocationContext, next: Next) => {
//             const requestContext = invocation.getSync<RequestContext>(
//                 RestBindings.Http.CONTEXT,
//             );
//             const request = requestContext.request;
//             if (request.query['oauth2-provider-name'] === 'facebook') {
//                 return toInterceptor(this.facebookStrategy)(invocation, next);
//             }
//             return next();
//         };
//     }
// }
//# sourceMappingURL=facebook-interceptor.js.map