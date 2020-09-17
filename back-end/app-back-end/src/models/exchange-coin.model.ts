import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Card, CardWithRelations} from './card.model';
import {User} from './user.model';

@model({settings: {strict: false}})
export class ExchangeCoin extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'number',
        required: true,
    })
    coin: number;

    @property({
        type: 'string',
        required: true,
    })
    hash: string;

    @property({
        type: 'date',
        required: true,
    })
    createdAt: Date;

    @belongsTo(() => Card)
    cardId: string;

    @belongsTo(() => User)
    userId: string;
    // Define well-known properties here

    // Indexer property to allow additional data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;

    constructor(data?: Partial<ExchangeCoin>) {
        super(data);
    }
}

export interface ExchangeCoinRelations {
    // describe navigational properties here
    card: CardWithRelations;
}

export type ExchangeCoinWithRelations = ExchangeCoin & ExchangeCoinRelations;
