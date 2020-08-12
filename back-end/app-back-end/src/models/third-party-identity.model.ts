import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class ThirdPartyIdentity extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'string',
    })
    provider?: string;

    @property({
        type: 'object',
    })
    profile?: object;

    @property({
        type: 'date',
        default: Date(),
    })
    createdAt?: string;

    @property({
        type: 'date',
        default: Date(),
    })
    modifiedAt?: string;

    @belongsTo(() => User, {keyTo: 'id'})
    userId?: string;

    constructor(data?: Partial<ThirdPartyIdentity>) {
        super(data);
    }
}

export interface ThirdPartyIdentityRelations {
    // describe navigational properties here
}

export type ThirdPartyIdentityWithRelations = ThirdPartyIdentity &
    ThirdPartyIdentityRelations;
