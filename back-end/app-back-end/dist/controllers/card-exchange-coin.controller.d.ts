import { Count, Filter, Where } from '@loopback/repository';
import { Card, ExchangeCoin } from '../models';
import { CardRepository } from '../repositories';
export declare class CardExchangeCoinController {
    protected cardRepository: CardRepository;
    constructor(cardRepository: CardRepository);
    find(id: string, filter?: Filter<ExchangeCoin>): Promise<ExchangeCoin[]>;
    create(id: typeof Card.prototype.id, exchangeCoin: Omit<ExchangeCoin, 'id'>): Promise<ExchangeCoin>;
    patch(id: string, exchangeCoin: Partial<ExchangeCoin>, where?: Where<ExchangeCoin>): Promise<Count>;
    delete(id: string, where?: Where<ExchangeCoin>): Promise<Count>;
}
