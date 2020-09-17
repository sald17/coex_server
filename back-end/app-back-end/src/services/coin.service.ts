import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import Axios from 'axios';
import {CoinServer, PointConstant} from '../config/constants';
import {UserRepository} from '../repositories';
@bind({scope: BindingScope.TRANSIENT})
export class CoinService {
    constructor(/* Add @inject to inject parameters */) {}

    async pointToCoin(email: string, point: number) {
        const coin = point / PointConstant.PointToCoin + '';
        const bodyData = new URLSearchParams();
        bodyData.append('email', email);
        bodyData.append('coin', coin);
        console.log(bodyData);
        const result = (await Axios.post(`${CoinServer}/addCoin`, bodyData))
            .data;
        return {...result, earnCoin: coin};
    }

    async withdraw(coin: number, email: string, address: string) {
        const bodyData = {email, coin, address};

        const result = (await Axios.post(`${CoinServer}/withdrawEth`, bodyData))
            .data;

        return {...result};
    }

    async getCoin(user: any, userRepository: UserRepository) {
        const res = await Axios({
            method: 'get',
            url: `${CoinServer}/getCoin`,
            data: {
                email: user.email,
            },
        }).then(res => res.data);
        if (res?.coin != undefined) {
            if (res.coin != user.coin) {
                user.coin = res.coin;
                await userRepository.update(user);
            }
            return user.coin;
        } else {
            throw new HttpErrors.BadRequest('Cannot get coin');
        }
    }
}
