"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const axios_1 = tslib_1.__importDefault(require("axios"));
const constants_1 = require("../config/constants");
const key_1 = require("../config/key");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
// import {inject} from '@loopback/core';
let PointController = class PointController {
    constructor(userRepository, cardRepository, pointRepository, coinRepository, user, coinService) {
        this.userRepository = userRepository;
        this.cardRepository = cardRepository;
        this.pointRepository = pointRepository;
        this.coinRepository = coinRepository;
        this.user = user;
        this.coinService = coinService;
    }
    async pointToCoin(body) {
        const user = await this.userRepository.findById(this.user[security_1.securityId]);
        if (!body.point || body.point % 1 !== 0 || body.point <= 0) {
            throw new rest_1.HttpErrors.BadRequest('Invalid Point');
        }
        if (user.point < body.point) {
            throw new rest_1.HttpErrors.BadRequest('Not enough point');
        }
        const response = await this.coinService.pointToCoin(user.email, body.point);
        if (response.createdAt === undefined ||
            response.updatedAt === undefined ||
            response.coin === undefined) {
            throw new rest_1.HttpErrors.BadRequest(`Can't convert to coin`);
        }
        const timestamp = response.updatedAt;
        user.point -= body.point;
        user.modifiedAt = timestamp;
        user.coin = response.coin;
        this.userRepository.update(user);
        this.pointRepository.create({
            createdAt: timestamp,
            type: constants_1.PointConstant.EXCHANGE_TYPE.CONVERT,
            point: -body.point,
            userId: user.id,
        });
        return {
            point: user.point,
            coin: user.coin,
        };
    }
    // withdraw: convert coin from coex to your wallet
    async withdrawCoin(body) {
        const user = await this.userRepository.findById(this.user[security_1.securityId]);
        if (!body.coin || body.coin <= 0) {
            throw new rest_1.HttpErrors.BadRequest('Invalid Point');
        }
        if (user.coin < body.coin) {
            throw new rest_1.HttpErrors.BadRequest('Not enough point');
        }
        const card = await this.cardRepository.findOne({
            where: {
                userId: this.user[security_1.securityId],
                address: body.address,
            },
        });
        if (!card) {
            throw new rest_1.HttpErrors.BadRequest(`Invalid address`);
        }
        const response = await this.coinService.withdraw(body.coin, user.email, body.address);
        console.log(response);
        if (response.status === 'fail') {
            throw new rest_1.HttpErrors.BadRequest(response.message);
        }
        const timestamp = new Date();
        user.modifiedAt = timestamp;
        user.coin -= body.coin;
        this.userRepository.update(user);
        this.cardRepository.exchangeCoins(card === null || card === void 0 ? void 0 : card.id).create({
            coin: -body.coin,
            createdAt: timestamp,
            hash: response['transaction_hash'],
        });
        return {
            coin: user.coin,
        };
    }
    async getPointHistory() {
        return {
            coin: await this.coinRepository.find({
                where: {
                    userId: this.user[security_1.securityId],
                },
            }),
            point: await this.pointRepository.find({
                where: { userId: this.user[security_1.securityId] },
            }),
        };
    }
    async getCoinOfUser() {
        const user = await this.userRepository.findById(this.user[security_1.securityId]);
        const coin = await this.coinService.getCoin(user, this.userRepository);
        user.coin = coin;
        return { current_coin: user.coin };
    }
    async getCoin(user) {
        const res = (await axios_1.default.get(`${constants_1.CoinServer}/getCoin`, {
            data: { email: user.email },
        })).data;
        if ((res === null || res === void 0 ? void 0 : res.coin) != undefined) {
            if (res.coin != user.coin) {
                user.coin = res.coin;
                await this.userRepository.update(user);
            }
            return user.coin;
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('Cannot get coin');
        }
    }
};
tslib_1.__decorate([
    rest_1.post('/point'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PointController.prototype, "pointToCoin", null);
tslib_1.__decorate([
    rest_1.post('/coin/withdraw'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PointController.prototype, "withdrawCoin", null);
tslib_1.__decorate([
    rest_1.get('/coin-point/history'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PointController.prototype, "getPointHistory", null);
tslib_1.__decorate([
    rest_1.get('/coin'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PointController.prototype, "getCoinOfUser", null);
PointController = tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.CardRepository)),
    tslib_1.__param(2, repository_1.repository(repositories_1.ExchangePointRepository)),
    tslib_1.__param(3, repository_1.repository(repositories_1.ExchangeCoinRepository)),
    tslib_1.__param(4, core_1.inject(security_1.SecurityBindings.USER, { optional: true })),
    tslib_1.__param(5, core_1.inject(key_1.COIN_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        repositories_1.CardRepository,
        repositories_1.ExchangePointRepository,
        repositories_1.ExchangeCoinRepository, Object, services_1.CoinService])
], PointController);
exports.PointController = PointController;
//# sourceMappingURL=point.controller.js.map