"use strict";
var UserAccountInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountInterceptor = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
let UserAccountInterceptor = UserAccountInterceptor_1 = class UserAccountInterceptor {
    value() {
        return this.intercept.bind(this);
    }
    async intercept(invocationCtx, next) {
        switch (invocationCtx.methodName) {
            case 'signup':
                const { password, email } = invocationCtx.args[0];
                if (!UserAccountInterceptor_1.passwordPattern.test(password)) {
                    throw new rest_1.HttpErrors.BadRequest(`Password must have the length of 8-30 and have at least one uppercase, one lowercase and one digit`);
                }
                else if (!UserAccountInterceptor_1.emailPattern.test(email)) {
                    throw new rest_1.HttpErrors.BadRequest(`Please register with a valid email.`);
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
};
UserAccountInterceptor.BINDING_KEY = `interceptors.${UserAccountInterceptor_1.name}`;
UserAccountInterceptor.emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
UserAccountInterceptor.passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,30}/;
UserAccountInterceptor = UserAccountInterceptor_1 = tslib_1.__decorate([
    core_1.bind({ tags: { key: UserAccountInterceptor_1.BINDING_KEY } })
], UserAccountInterceptor);
exports.UserAccountInterceptor = UserAccountInterceptor;
//# sourceMappingURL=user-account-interceptor.js.map