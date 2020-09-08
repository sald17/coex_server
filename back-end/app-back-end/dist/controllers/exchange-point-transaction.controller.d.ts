import { ExchangePoint, Transaction } from '../models';
import { ExchangePointRepository } from '../repositories';
export declare class ExchangePointTransactionController {
    exchangePointRepository: ExchangePointRepository;
    constructor(exchangePointRepository: ExchangePointRepository);
    getTransaction(id: typeof ExchangePoint.prototype.id): Promise<Transaction>;
}
