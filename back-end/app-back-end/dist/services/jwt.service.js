"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const util_1 = require("util");
// import JWT from 'jsonwebtoken';
const key_1 = require("../config/key");
const JWT = require('jsonwebtoken');
const signAsync = util_1.promisify(JWT.sign);
const verifyAsync = util_1.promisify(JWT.verify);
let JwtService = class JwtService {
    constructor(secretKey, expireValue) {
        this.secretKey = secretKey;
        this.expireValue = expireValue;
    }
    async verifyToken(token) {
        const INVALID_TOKEN_MESSAGE = 'Invalid Token';
        if (!token) {
            throw new rest_1.HttpErrors.Unauthorized(INVALID_TOKEN_MESSAGE);
        }
        let isValid = await verifyAsync(token, this.secretKey);
        if (!isValid) {
            throw new rest_1.HttpErrors.Unauthorized(INVALID_TOKEN_MESSAGE);
        }
        // console.log(isValid);
        let userProfile = Object.assign({
            [security_1.securityId]: isValid.id,
            profile: {
                ...isValid,
            },
        });
        return userProfile;
    }
    async generateToken(user) {
        if (!user) {
            throw new rest_1.HttpErrors.Unauthorized('Invalid user');
        }
        const token = signAsync(user.profile, this.secretKey, {
            expiresIn: Number(this.expireValue),
        });
        return token;
    }
};
JwtService = tslib_1.__decorate([
    core_1.bind({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, core_1.inject(key_1.JwtServiceBindings.SECRET_KEY)),
    tslib_1.__param(1, core_1.inject(key_1.JwtServiceBindings.TOKEN_EXPIRES_IN)),
    tslib_1.__metadata("design:paramtypes", [String, String])
], JwtService);
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.service.js.map