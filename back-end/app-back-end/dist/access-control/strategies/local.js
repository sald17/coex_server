"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalAuthStrategy = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authentication_passport_1 = require("@loopback/authentication-passport");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const passport_local_1 = require("passport-local");
const key_1 = require("../../config/key");
const repositories_1 = require("../../repositories");
const password_hasher_service_1 = require("../../services/password-hasher.service");
const types_1 = require("./types");
let LocalAuthStrategy = class LocalAuthStrategy {
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.name = 'local';
        this.passportStrategy = new passport_local_1.Strategy({
            usernameField: 'email',
            passwordField: 'password',
        }, this.verify.bind(this));
        this.strategy = new authentication_passport_1.StrategyAdapter(this.passportStrategy, this.name, types_1.mapProfile.bind(this));
    }
    async authenticate(request) {
        return await this.strategy.authenticate(request);
    }
    async verify(email, password, done) {
        const AUTH_FAILED_MESSAGE = 'Incorrect email or password.';
        const EMAIL_VERIFIED_FAILED_MESSAGE = 'Email not verified.';
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            return done(null, null, { message: AUTH_FAILED_MESSAGE });
        }
        if (!(user === null || user === void 0 ? void 0 : user.emailVerified)) {
            return done(null, null, { message: EMAIL_VERIFIED_FAILED_MESSAGE });
        }
        const isPasswordMatched = await this.passwordHasher.comparePassword(password, user.password);
        if (!isPasswordMatched) {
            return done(null, null, { message: AUTH_FAILED_MESSAGE });
        }
        return done(null, user);
    }
};
LocalAuthStrategy = tslib_1.__decorate([
    core_1.bind(authentication_1.asAuthStrategy),
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, core_1.inject(key_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        password_hasher_service_1.PasswordHasherService])
], LocalAuthStrategy);
exports.LocalAuthStrategy = LocalAuthStrategy;
//# sourceMappingURL=local.js.map