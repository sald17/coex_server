import {
    belongsTo,
    Entity,
    hasMany,
    model,
    property,
} from '@loopback/repository';
import {ExchangeCoin, ExchangeCoinWithRelations} from './exchange-coin.model';
import {User} from './user.model';

@model()
export class Card extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'string',
        required: true,
        unique: true,
    })
    name: string;

    @property({
        type: 'string',
        required: true,
    })
    address: string;

    @belongsTo(() => User)
    userId: string;

    @hasMany(() => ExchangeCoin)
    exchangeCoins: ExchangeCoin[];

    constructor(data?: Partial<Card>) {
        super(data);
    }
}

export interface CardRelations {
    // describe navigational properties here
    exchangeCoins: ExchangeCoinWithRelations[];
}

export type CardWithRelations = Card & CardRelations;
