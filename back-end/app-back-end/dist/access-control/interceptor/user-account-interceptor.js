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
        const detail = invocationCtx['_parent'];
        switch (invocationCtx.methodName) {
            case 'signup': //Check if password and email are valid
                const { password, email } = invocationCtx.args[0];
                if (password.length < 8 || password.length > 30) {
                    throw new rest_1.HttpErrors.BadRequest(`Password must have the length of 8-30.`);
                }
                else if (!UserAccountInterceptor_1.emailPattern.test(email)) {
                    throw new rest_1.HttpErrors.BadRequest(`Please register with a valid email.`);
                }
                break;
            case 'resetPassword':
            case 'changePassword': //Check if new password and confirmation are valid
                const { oldPass, newPass, confPass } = detail['request'].body;
                if (newPass !== confPass) {
                    throw new rest_1.HttpErrors.BadRequest('New password is not match.');
                }
                if (!UserAccountInterceptor_1.passwordPattern.test(newPass)) {
                    throw new rest_1.HttpErrors.BadRequest(`Password must have the length of 8-30 and have at least one uppercase, one lowercase and one digit`);
                }
                break;
            case 'forgotPassword':
                const { email: emailCredential } = detail['request'].body;
                if (!UserAccountInterceptor_1.emailPattern.test(emailCredential)) {
                    throw new rest_1.HttpErrors.BadRequest(`Invalid email.`);
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
};
UserAccountInterceptor.BINDING_KEY = `interceptors.${UserAccountInterceptor_1.name}`;
UserAccountInterceptor.emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
UserAccountInterceptor.passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,30}/;
UserAccountInterceptor = UserAccountInterceptor_1 = tslib_1.__decorate([
    core_1.bind({ tags: { key: UserAccountInterceptor_1.BINDING_KEY } })
], UserAccountInterceptor);
exports.UserAccountInterceptor = UserAccountInterceptor;
//# sourceMappingURL=user-account-interceptor.js.map