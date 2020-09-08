import { Entity } from '@loopback/repository';
export declare class ExchangePoint extends Entity {
    id?: string;
    createdAt: Date;
    type: string;
    point: number;
    transactionId: string;
    userId: string;
    constructor(data?: Partial<ExchangePoint>);
}
export interface ExchangePointRelations {
}
export declare type ExchangePointWithRelations = ExchangePoint & ExchangePointRelations;
