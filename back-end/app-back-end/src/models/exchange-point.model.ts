import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Transaction} from './transaction.model';
import {User} from './user.model';

@model()
export class ExchangePoint extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'date',
        required: true,
    })
    createdAt: Date;

    @property({
        type: 'string',
        required: true,
    })
    type: string;

    @property({
        type: 'number',
        require: true,
    })
    point: number;

    @belongsTo(() => Transaction)
    transactionId: string;

    @belongsTo(() => User)
    userId: string;

    constructor(data?: Partial<ExchangePoint>) {
        super(data);
    }
}

export interface ExchangePointRelations {
    // describe navigational properties here
}

export type ExchangePointWithRelations = ExchangePoint & ExchangePointRelations;
