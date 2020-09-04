"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHasherService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const bcrypt = tslib_1.__importStar(require("bcryptjs"));
const key_1 = require("../config/key");
let PasswordHasherService = class PasswordHasherService {
    constructor(round) {
        this.round = round;
    }
    async hashPassword(password) {
        const salt = bcrypt.genSaltSync(this.round);
        return bcrypt.hash(password, salt);
    }
    async comparePassword(providedPassword, storedPassword) {
        let isMatched = await bcrypt.compare(providedPassword, storedPassword);
        return isMatched;
    }
    async generateOTP() {
        const max = 999999, min = 100000;
        return Math.floor(Math.random() * (max - min) + min) + '';
    }
    getStoreValue(token) {
        return `${token.jti}:${token.exp}`;
    }
};
PasswordHasherService = tslib_1.__decorate([
    core_1.bind({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, core_1.inject(key_1.PasswordHasherBindings.ROUNDS)),
    tslib_1.__metadata("design:paramtypes", [Number])
], PasswordHasherService);
exports.PasswordHasherService = PasswordHasherService;
//# sourceMappingURL=password-hasher.service.js.map