// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, HttpErrors, post, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import Axios from 'axios';
import {CoinServer, PointConstant} from '../config/constants';
import {COIN_SERVICE} from '../config/key';
import {
    CardRepository,
    ExchangeCoinRepository,
    ExchangePointRepository,
    UserRepository,
} from '../repositories';
import {CoinService} from '../services';

// import {inject} from '@loopback/core';

@authenticate('jwt')
export class PointController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(CardRepository) public cardRepository: CardRepository,
        @repository(ExchangePointRepository)
        public pointRepository: ExchangePointRepository,
        @repository(ExchangeCoinRepository)
        public coinRepository: ExchangeCoinRepository,
        @inject(SecurityBindings.USER, {optional: true})
        private user: UserProfile,
        @inject(COIN_SERVICE) private coinService: CoinService,
    ) {}

    @post('/point')
    async pointToCoin(@requestBody() body: {point: number}) {
        const user = await this.userRepository.findById(this.user[securityId]);
        if (!body.point || body.point % 1 !== 0 || body.point <= 0) {
            throw new HttpErrors.BadRequest('Invalid Point');
        }
        if (user.point < body.point) {
            throw new HttpErrors.BadRequest('Not enough point');
        }

        const response = await this.coinService.pointToCoin(
            user.email,
            body.point,
        );
        if (
            response.createdAt === undefined ||
            response.updatedAt === undefined ||
            response.coin === undefined
        ) {
            throw new HttpErrors.BadRequest(`Can't convert to coin`);
        }

        const timestamp = response.updatedAt;
        user.point -= body.point;
        user.modifiedAt = timestamp;
        user.coin = response.coin;
        this.userRepository.update(user);
        this.pointRepository.create({
            createdAt: timestamp,
            type: PointConstant.EXCHANGE_TYPE.CONVERT,
            point: -body.point,
            userId: user.id,
        });
        return {
            point: user.point,
            coin: user.coin,
        };
    }

    // withdraw: convert coin from coex to your wallet
    @post('/coin/withdraw')
    async withdrawCoin(@requestBody() body: {coin: number; address: string}) {
        const user = await this.userRepository.findById(this.user[securityId]);
        if (!body.coin || body.coin <= 0) {
            throw new HttpErrors.BadRequest('Invalid Point');
        }
        if (user.coin < body.coin) {
            throw new HttpErrors.BadRequest('Not enough point');
        }
        const card = await this.cardRepository.findOne({
            where: {
                userId: this.user[securityId],
                address: body.address,
            },
        });
        if (!card) {
            throw new HttpErrors.BadRequest(`Invalid address`);
        }

        const response = await this.coinService.withdraw(
            body.coin,
            user.email,
            body.address,
        );
        console.log(response);
        if (response.status === 'fail') {
            throw new HttpErrors.BadRequest(response.message);
        }

        const timestamp = new Date();
        user.modifiedAt = timestamp;
        user.coin -= body.coin;
        this.userRepository.update(user);
        this.cardRepository.exchangeCoins(card?.id).create({
            coin: -body.coin,
            createdAt: timestamp,
            hash: response['transaction_hash'],
        });
        return {
            coin: user.coin,
        };
    }

    @get('/coin-point/history')
    async getPointHistory() {
        return {
            coin: await this.coinRepository.find({
                where: {
                    userId: this.user[securityId],
                },
            }),
            point: await this.pointRepository.find({
                where: {userId: this.user[securityId]},
            }),
        };
    }

    @get('/coin')
    async getCoinOfUser() {
        const user = await this.userRepository.findById(this.user[securityId]);

        const coin = await this.coinService.getCoin(user, this.userRepository);
        user.coin = coin;
        return {current_coin: user.coin};
    }

    async getCoin(user: any) {
        const res = (
            await Axios.get(`${CoinServer}/getCoin`, {
                data: {email: user.email},
            })
        ).data;
        if (res?.coin != undefined) {
            if (res.coin != user.coin) {
                user.coin = res.coin;
                await this.userRepository.update(user);
            }
            return user.coin;
        } else {
            throw new HttpErrors.BadRequest('Cannot get coin');
        }
    }
}
