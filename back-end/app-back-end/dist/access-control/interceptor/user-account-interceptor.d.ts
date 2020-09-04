import { Interceptor, InvocationContext, InvocationResult, Provider, ValueOrPromise } from '@loopback/core';
export declare class UserAccountInterceptor implements Provider<Interceptor> {
    static readonly BINDING_KEY: string;
    private static readonly emailPattern;
    static passwordPattern: RegExp;
    value(): (invocationCtx: InvocationContext, next: () => any) => Promise<any>;
    intercept(invocationCtx: InvocationContext, next: () => ValueOrPromise<InvocationResult>): Promise<any>;
}
