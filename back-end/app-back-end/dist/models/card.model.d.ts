import { Entity } from '@loopback/repository';
import { ExchangeCoin, ExchangeCoinWithRelations } from './exchange-coin.model';
export declare class Card extends Entity {
    id?: string;
    name: string;
    address: string;
    userId: string;
    exchangeCoins: ExchangeCoin[];
    constructor(data?: Partial<Card>);
}
export interface CardRelations {
    exchangeCoins: ExchangeCoinWithRelations[];
}
export declare type CardWithRelations = Card & CardRelations;
