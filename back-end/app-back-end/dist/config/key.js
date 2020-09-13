"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTHORIZATION_SERVICE = exports.RESOURCE_ID = exports.STORAGE_DIRECTORY = exports.COIN_SERVICE = exports.FILE_UPLOAD_SERVICE = exports.EmailServiceBindings = exports.UserServiceBindings = exports.PassportAuthenticationServiceBindings = exports.PasswordHasherBindings = exports.JwtServiceBindings = exports.JwtServiceConstants = void 0;
const core_1 = require("@loopback/core");
var JwtServiceConstants;
(function (JwtServiceConstants) {
    JwtServiceConstants.SECRET_KEY = 'secretKey';
    JwtServiceConstants.EXPIRES_VALUE = 60 * 10; //secs
})(JwtServiceConstants = exports.JwtServiceConstants || (exports.JwtServiceConstants = {}));
var JwtServiceBindings;
(function (JwtServiceBindings) {
    JwtServiceBindings.SECRET_KEY = core_1.BindingKey.create('authentication.jwt.secret');
    JwtServiceBindings.TOKEN_EXPIRES_IN = core_1.BindingKey.create('authentication.jwt.expires.in.seconds');
    JwtServiceBindings.TOKEN_SERVICE = core_1.BindingKey.create('services.authentication.jwt.tokenservice');
})(JwtServiceBindings = exports.JwtServiceBindings || (exports.JwtServiceBindings = {}));
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
var EmailServiceBindings;
(function (EmailServiceBindings) {
    EmailServiceBindings.EMAIL_SERVICE = core_1.BindingKey.create('services.email');
})(EmailServiceBindings = exports.EmailServiceBindings || (exports.EmailServiceBindings = {}));
/**
 * Binding key for the file upload service
 */
exports.FILE_UPLOAD_SERVICE = core_1.BindingKey.create('services.FileUpload');
exports.COIN_SERVICE = core_1.BindingKey.create('services.coin');
/**
 * Binding key for the storage directory
 */
exports.STORAGE_DIRECTORY = core_1.BindingKey.create('storage.directory');
exports.RESOURCE_ID = core_1.BindingKey.create('resourceId');
exports.AUTHORIZATION_SERVICE = core_1.BindingKey.create('authorizationProviders.my-provider');
//# sourceMappingURL=key.js.map