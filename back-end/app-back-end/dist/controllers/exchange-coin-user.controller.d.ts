import { ExchangeCoin, User } from '../models';
import { ExchangeCoinRepository } from '../repositories';
export declare class ExchangeCoinUserController {
    exchangeCoinRepository: ExchangeCoinRepository;
    constructor(exchangeCoinRepository: ExchangeCoinRepository);
    getUser(id: typeof ExchangeCoin.prototype.id): Promise<User>;
}
