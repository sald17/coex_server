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
        const detail: any = invocationCtx['_parent'];
        switch (invocationCtx.methodName) {
            case 'signup': //Check if password and email are valid
                const {password, email} = invocationCtx.args[0];
                if (password.length < 8 || password.length > 30) {
                    throw new HttpErrors.BadRequest(
                        `Password must have the length of 8-30.`,
                    );
                } else if (!UserAccountInterceptor.emailPattern.test(email)) {
                    throw new HttpErrors.BadRequest(
                        `Please register with a valid email.`,
                    );
                }
                break;
            case 'resetPassword':
            case 'changePassword': //Check if new password and confirmation are valid
                const {oldPass, newPass, confPass} = detail['request'].body;
                if (newPass !== confPass) {
                    throw new HttpErrors.BadRequest(
                        'New password is not match.',
                    );
                }
                if (!UserAccountInterceptor.passwordPattern.test(newPass)) {
                    throw new HttpErrors.BadRequest(
                        `Password must have the length of 8-30 and have at least one uppercase, one lowercase and one digit`,
                    );
                }
                break;
            case 'forgotPassword':
                const {email: emailCredential} = detail['request'].body;
                if (
                    !UserAccountInterceptor.emailPattern.test(emailCredential)
                ) {
                    throw new HttpErrors.BadRequest(`Invalid email.`);
                }
                break;
            //     console.log('asdfasdfasdfasdf');
            //     break;
            default:
                break;
        }

        // console.log(invocationCtx.methodName);
        const res = await next();
        return res;
    }
}
