"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtServiceBindings = exports.UserServiceBindings = exports.PassportAuthenticationServiceBindings = exports.PasswordHasherBindings = exports.JwtServiceConstants = void 0;
const core_1 = require("@loopback/core");
var JwtServiceConstants;
(function (JwtServiceConstants) {
    JwtServiceConstants.SECRET_KEY = 'secretKey';
    JwtServiceConstants.EXPIRES_VALUE = '10000';
})(JwtServiceConstants = exports.JwtServiceConstants || (exports.JwtServiceConstants = {}));
var PasswordHasherBindings;
(function (PasswordHasherBindings) {
    PasswordHasherBindings.PASSWORD_HASHER = core_1.BindingKey.create('services.hasher');
    PasswordHasherBindings.ROUNDS = core_1.BindingKey.create('services.hasher.round');
})(PasswordHasherBindings = exports.PasswordHasherBindings || (exports.PasswordHasherBindings = {}));
var PassportAuthenticationServiceBindings;
(function (PassportAuthenticationServiceBindings) {
    PassportAuthenticationServiceBindings.OAUTH2_STRATEGY = 'passport.authentication.oauth2.strategy';
})(PassportAuthenticationServiceBindings = exports.PassportAuthenticationServiceBindings || (exports.PassportAuthenticationServiceBindings = {}));
var UserServiceBindings;
(function (UserServiceBindings) {
    UserServiceBindings.USER_SERVICE = core_1.BindingKey.create('services.user.service');
    UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE = core_1.BindingKey.create('services.passport.identity');
})(UserServiceBindings = exports.UserServiceBindings || (exports.UserServiceBindings = {}));
var JwtServiceBindings;
(function (JwtServiceBindings) {
    JwtServiceBindings.SECRET_KEY = core_1.BindingKey.create('authentication.jwt.secret');
    JwtServiceBindings.TOKEN_EXPIRES_IN = core_1.BindingKey.create('authentication.jwt.expires.in.seconds');
    JwtServiceBindings.TOKEN_SERVICE = core_1.BindingKey.create('services.authentication.jwt.tokenservice');
})(JwtServiceBindings = exports.JwtServiceBindings || (exports.JwtServiceBindings = {}));
//# sourceMappingURL=key.js.map