import { Entity } from '@loopback/repository';
import { CardWithRelations } from './card.model';
export declare class ExchangeCoin extends Entity {
    id?: string;
    coin: number;
    hash: string;
    createdAt: Date;
    cardId: string;
    userId: string;
    [prop: string]: any;
    constructor(data?: Partial<ExchangeCoin>);
}
export interface ExchangeCoinRelations {
    card: CardWithRelations;
}
export declare type ExchangeCoinWithRelations = ExchangeCoin & ExchangeCoinRelations;
