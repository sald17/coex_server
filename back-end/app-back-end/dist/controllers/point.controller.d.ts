import { UserProfile } from '@loopback/security';
import { CardRepository, ExchangeCoinRepository, ExchangePointRepository, UserRepository } from '../repositories';
import { CoinService } from '../services';
export declare class PointController {
    userRepository: UserRepository;
    cardRepository: CardRepository;
    pointRepository: ExchangePointRepository;
    coinRepository: ExchangeCoinRepository;
    private user;
    private coinService;
    constructor(userRepository: UserRepository, cardRepository: CardRepository, pointRepository: ExchangePointRepository, coinRepository: ExchangeCoinRepository, user: UserProfile, coinService: CoinService);
    pointToCoin(body: {
        point: number;
    }): Promise<{
        point: number;
        coin: number;
    }>;
    withdrawCoin(body: {
        coin: number;
        address: string;
    }): Promise<{
        coin: number;
    }>;
    getPointHistory(): Promise<{
        coin: import("../models").ExchangeCoinWithRelations[];
        point: (import("../models").ExchangePoint & import("../models").ExchangePointRelations)[];
    }>;
    getCoinOfUser(): Promise<{
        current_coin: number;
    }>;
    getCoin(user: any): Promise<any>;
}
