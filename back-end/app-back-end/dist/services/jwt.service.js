"use strict";
var JwtService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const util_1 = require("util");
const uuid_1 = require("uuid");
const _1 = require(".");
const key_1 = require("../config/key");
const repositories_1 = require("../repositories");
const JWT = require('jsonwebtoken');
const signAsync = util_1.promisify(JWT.sign);
const verifyAsync = util_1.promisify(JWT.verify);
let JwtService = JwtService_1 = class JwtService {
    constructor(passwordService, secretKey, expireValue, blacklist) {
        this.passwordService = passwordService;
        this.secretKey = secretKey;
        this.expireValue = expireValue;
        this.blacklist = blacklist;
    }
    async verifyToken(token) {
        if (!token) {
            throw new rest_1.HttpErrors.Unauthorized(JwtService_1.INVALID_TOKEN_MESSAGE);
        }
        let validProfile;
        try {
            validProfile = await verifyAsync(token, this.secretKey);
        }
        catch (error) {
            if (error.name == 'TokenExpiredError') {
                throw new rest_1.HttpErrors.BadRequest(JwtService_1.EXPIRED_TOKEN_MESSAGE);
            }
        }
        if (!validProfile) {
            throw new rest_1.HttpErrors.Unauthorized(JwtService_1.INVALID_TOKEN_MESSAGE);
        }
        const storeVal = this.passwordService.getStoreValue(validProfile);
        if (await this.blacklist.checkToken(storeVal)) {
            throw new rest_1.HttpErrors.Unauthorized(JwtService_1.INVALID_TOKEN_MESSAGE);
        }
        let userProfile = Object.assign({
            [security_1.securityId]: validProfile.profile.id,
            ...validProfile,
        });
        return userProfile;
    }
    async generateToken(user, expire = Number(this.expireValue)) {
        if (!user) {
            throw new rest_1.HttpErrors.Unauthorized('Invalid user');
        }
        let payload = Object.assign({}, user, { jti: uuid_1.v4() });
        const token = signAsync(payload, this.secretKey, {
            expiresIn: expire,
        });
        return token;
    }
    async generateRefreshToken(user) {
        if (!user) {
            throw new rest_1.HttpErrors.Unauthorized('Invalid user');
        }
        let payload = Object.assign({}, user, { jti: uuid_1.v4() });
        const token = signAsync(payload, this.secretKey);
        return token;
    }
};
JwtService.INVALID_TOKEN_MESSAGE = 'Invalid Token';
JwtService.EXPIRED_TOKEN_MESSAGE = 'Expired Token';
JwtService = JwtService_1 = tslib_1.__decorate([
    core_1.bind({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, core_1.inject(key_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__param(1, core_1.inject(key_1.JwtServiceBindings.SECRET_KEY)),
    tslib_1.__param(2, core_1.inject(key_1.JwtServiceBindings.TOKEN_EXPIRES_IN)),
    tslib_1.__param(3, repository_1.repository(repositories_1.BlacklistRepository)),
    tslib_1.__metadata("design:paramtypes", [_1.PasswordHasherService, String, String, repositories_1.BlacklistRepository])
], JwtService);
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.service.js.map