import {
    bind,
    Interceptor,
    InvocationContext,
    InvocationResult,
    Provider,
    ValueOrPromise,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
@bind({tags: {key: UserAccountInterceptor.BINDING_KEY}})
export class UserAccountInterceptor implements Provider<Interceptor> {
    static readonly BINDING_KEY = `interceptors.${UserAccountInterceptor.name}`;
    private static readonly emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public static passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,30}/;
    value() {
        return this.intercept.bind(this);
    }

    async intercept(
        invocationCtx: InvocationContext,
        next: () => ValueOrPromise<InvocationResult>,
    ) {
        switch (invocationCtx.methodName) {
            case 'signup':
                const {password, email} = invocationCtx.args[0];
                if (!UserAccountInterceptor.passwordPattern.test(password)) {
                    throw new HttpErrors.BadRequest(
                        `Password must have the length of 8-30 and have at least one uppercase, one lowercase and one digit`,
                    );
                } else if (!UserAccountInterceptor.emailPattern.test(email)) {
                    throw new HttpErrors.BadRequest(
                        `Please register with a valid email.`,
                    );
                }
                break;
            case 'logout':
                break;
            default:
                break;
        }

        // console.log(invocationCtx.methodName);
        const res = await next();
        return res;
    }
}
