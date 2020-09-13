import { ExchangeCoin, Card } from '../models';
import { ExchangeCoinRepository } from '../repositories';
export declare class ExchangeCoinCardController {
    exchangeCoinRepository: ExchangeCoinRepository;
    constructor(exchangeCoinRepository: ExchangeCoinRepository);
    getCard(id: typeof ExchangeCoin.prototype.id): Promise<Card>;
}
