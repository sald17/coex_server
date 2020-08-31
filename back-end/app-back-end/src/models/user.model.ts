import {Entity, hasMany, model, property} from '@loopback/repository';
import {ThirdPartyIdentity} from './third-party-identity.model';

@model()
export class User extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'string',
    })
    fullname?: string;

    @property({
        type: 'string',
    })
    gender?: string;

    @property({
        type: 'date',
    })
    birth?: string;

    @property({
        type: 'string',
    })
    phoneNumber?: string;

    @property({
        type: 'string',
        required: true,
        jsonSchema: {
            pattern: `^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`,
        },
    })
    email: string;

    @property({
        type: 'boolean',
        default: false,
    })
    emailVerified?: boolean;

    @property({
        type: 'string',
    })
    address?: string;

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

    @property({
        type: 'string',
    })
    avatar?: string;

    @property({
        type: 'string',
        required: true,
    })
    password: string;

    @property({
        type: 'string',
        default: '',
    })
    refreshToken: string;

    @property({
        type: 'array',
        itemType: 'string',
        required: true,
        default: ['client'],
    })
    role: string[];

    @hasMany(() => ThirdPartyIdentity, {keyTo: 'userId'})
    identities?: ThirdPartyIdentity[];

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {
    // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
