import { UserRepository } from '../repositories';
export declare class CoinService {
    constructor();
    pointToCoin(email: string, point: number): Promise<any>;
    withdraw(coin: number, email: string, address: string): Promise<any>;
    getCoin(user: any, userRepository: UserRepository): Promise<any>;
}
