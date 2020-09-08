import { ExchangePoint, User } from '../models';
import { ExchangePointRepository } from '../repositories';
export declare class ExchangePointUserController {
    exchangePointRepository: ExchangePointRepository;
    constructor(exchangePointRepository: ExchangePointRepository);
    getUser(id: typeof ExchangePoint.prototype.id): Promise<User>;
}
