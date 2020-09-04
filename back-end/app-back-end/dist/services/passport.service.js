"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const repositories_1 = require("../repositories");
let PassportService = class PassportService {
    constructor(userRepository) { }
    async findOrCreateUser(profile) {
        console.log(profile);
        throw new Error('Find or create user');
    }
    linkExternalProfile(userId, userIdentity) {
        console.log(userId);
        console.log(userIdentity);
        throw new Error('Link external profile');
    }
};
PassportService = tslib_1.__decorate([
    core_1.bind({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository])
], PassportService);
exports.PassportService = PassportService;
//# sourceMappingURL=passport.service.js.map