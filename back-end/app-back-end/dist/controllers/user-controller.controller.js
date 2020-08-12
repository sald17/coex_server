"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllerController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const key_1 = require("../config/key");
const repositories_1 = require("../repositories");
const jwt_service_1 = require("../services/jwt.service");
const password_hasher_service_1 = require("../services/password-hasher.service");
// import {inject} from '@loopback/core';
let UserControllerController = class UserControllerController {
    constructor(userRepository, thirdPartyRepository, passwordHasher, jwtService) {
        this.userRepository = userRepository;
        this.thirdPartyRepository = thirdPartyRepository;
        this.passwordHasher = passwordHasher;
        this.jwtService = jwtService;
    }
    async getUser(userProfile) {
        console.log('AHIHIHIHI');
        console.log(userProfile);
        return await this.userRepository.find({
            include: [
                {
                    relation: 'identities',
                },
            ],
        });
    }
    async getThirdParty() {
        return await this.thirdPartyRepository.find({
            include: [
                {
                    relation: 'user',
                },
            ],
        });
    }
    async signup(user) {
        console.log(user);
        let res = await this.passwordHasher.hashPassword(user.fullname);
        return { res };
    }
    async login(user, userProfile, request, response) {
        delete userProfile.profile.password;
        let token = await this.jwtService.generateToken(userProfile);
        return { token };
    }
};
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    rest_1.get('/users'),
    tslib_1.__param(0, core_1.inject(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "getUser", null);
tslib_1.__decorate([
    rest_1.get('/third-party'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "getThirdParty", null);
tslib_1.__decorate([
    rest_1.post('/user/sign-up'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "signup", null);
tslib_1.__decorate([
    authentication_1.authenticate('local'),
    rest_1.post('/user/log-in'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__param(1, core_1.inject(security_1.SecurityBindings.USER)),
    tslib_1.__param(2, core_1.inject(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__param(3, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "login", null);
UserControllerController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.ThirdPartyIdentityRepository)),
    tslib_1.__param(2, core_1.inject(key_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__param(3, core_1.inject(key_1.JwtServiceBindings.TOKEN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        repositories_1.ThirdPartyIdentityRepository,
        password_hasher_service_1.PasswordHasherService,
        jwt_service_1.JwtService])
], UserControllerController);
exports.UserControllerController = UserControllerController;
//# sourceMappingURL=user-controller.controller.js.map