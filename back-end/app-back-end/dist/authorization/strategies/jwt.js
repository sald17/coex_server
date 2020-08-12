"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTStrategy = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const key_1 = require("../../config/key");
const jwt_service_1 = require("../../services/jwt.service");
let JWTStrategy = class JWTStrategy {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.name = 'jwt';
        this.INVALID_TOKEN_MESSAGE = 'Invalid Token';
    }
    async authenticate(request) {
        let token = this.extractToken(request);
        let userProfile = await this.jwtService.verifyToken(token);
        return userProfile;
    }
    extractToken(request) {
        let authHeader = request.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) || !authHeader) {
            throw new rest_1.HttpErrors.NotAcceptable(this.INVALID_TOKEN_MESSAGE);
        }
        let parts = authHeader.split(' ');
        if (parts.length != 2) {
            throw new rest_1.HttpErrors.NotAcceptable(this.INVALID_TOKEN_MESSAGE);
        }
        return parts[1];
    }
};
JWTStrategy = tslib_1.__decorate([
    core_1.bind(authentication_1.asAuthStrategy),
    tslib_1.__param(0, core_1.inject(key_1.JwtServiceBindings.TOKEN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [jwt_service_1.JwtService])
], JWTStrategy);
exports.JWTStrategy = JWTStrategy;
//# sourceMappingURL=jwt.js.map