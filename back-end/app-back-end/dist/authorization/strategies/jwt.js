"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTStrategy = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const key_1 = require("../../config/key");
const repositories_1 = require("../../repositories");
const jwt_service_1 = require("../../services/jwt.service");
let JWTStrategy = class JWTStrategy {
    constructor(blacklist, jwtService) {
        this.blacklist = blacklist;
        this.jwtService = jwtService;
        this.name = 'jwt';
    }
    async authenticate(request) {
        let token = this.extractToken(request);
        let userProfile = await this.jwtService.verifyToken(token);
        const isValid = await this.blacklist.checkToken(`${userProfile.jti}:${userProfile.exp}`);
        if (isValid) {
            throw new rest_1.HttpErrors.NotAcceptable(jwt_service_1.JwtService.INVALID_TOKEN_MESSAGE);
        }
        if (request.url.includes('logout')) {
            userProfile.profile.token = token;
        }
        return userProfile;
    }
    extractToken(request) {
        let authHeader = request.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) || !authHeader) {
            throw new rest_1.HttpErrors.NotAcceptable(jwt_service_1.JwtService.INVALID_TOKEN_MESSAGE);
        }
        let parts = authHeader.split(' ');
        if (parts.length != 2) {
            throw new rest_1.HttpErrors.NotAcceptable(jwt_service_1.JwtService.INVALID_TOKEN_MESSAGE);
        }
        return parts[1];
    }
};
JWTStrategy = tslib_1.__decorate([
    core_1.bind(authentication_1.asAuthStrategy),
    tslib_1.__param(0, repository_1.repository(repositories_1.BlacklistRepository)),
    tslib_1.__param(1, core_1.inject(key_1.JwtServiceBindings.TOKEN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BlacklistRepository,
        jwt_service_1.JwtService])
], JWTStrategy);
exports.JWTStrategy = JWTStrategy;
//# sourceMappingURL=jwt.js.map