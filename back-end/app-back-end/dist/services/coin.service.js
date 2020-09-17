"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const axios_1 = tslib_1.__importDefault(require("axios"));
const constants_1 = require("../config/constants");
let CoinService = class CoinService {
    constructor( /* Add @inject to inject parameters */) { }
    async pointToCoin(email, point) {
        const coin = point / constants_1.PointConstant.PointToCoin + '';
        const bodyData = new URLSearchParams();
        bodyData.append('email', email);
        bodyData.append('coin', coin);
        console.log(bodyData);
        const result = (await axios_1.default.post(`${constants_1.CoinServer}/addCoin`, bodyData))
            .data;
        return { ...result, earnCoin: coin };
    }
    async withdraw(coin, email, address) {
        const bodyData = { email, coin, address };
        const result = (await axios_1.default.post(`${constants_1.CoinServer}/withdrawEth`, bodyData))
            .data;
        return { ...result };
    }
    async getCoin(user, userRepository) {
        const res = await axios_1.default({
            method: 'get',
            url: `${constants_1.CoinServer}/getCoin`,
            data: {
                email: user.email,
            },
        }).then(res => res.data);
        if ((res === null || res === void 0 ? void 0 : res.coin) != undefined) {
            if (res.coin != user.coin) {
                user.coin = res.coin;
                await userRepository.update(user);
            }
            return user.coin;
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('Cannot get coin');
        }
    }
};
CoinService = tslib_1.__decorate([
    core_1.bind({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], CoinService);
exports.CoinService = CoinService;
//# sourceMappingURL=coin.service.js.map