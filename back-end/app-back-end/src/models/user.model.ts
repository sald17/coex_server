import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Booking} from './booking.model';
import {CoWorking} from './co-working.model';

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
            pattern: `^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$`,
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
        default: 'default/user-account.png',
    })
    avatar?: string;

    @property({
        type: 'number',
        default: 0,
    })
    point?: number;

    @property({
        type: 'number',
        default: 0,
    })
    coin?: number;

    @property({
        type: 'string',
        required: true,
    })
    password: string;

    @property({
        type: 'string',
        default: [],
    })
    token: string[];

    @property({
        type: 'string',
        default: [],
    })
    firebaseToken: string[];

    @property({
        type: 'array',
        itemType: 'string',
        required: true,
        default: [],
    })
    role: string[];

    @hasOne(() => CoWorking)
    coWorking: CoWorking;

    @hasMany(() => Booking)
    bookings: Booking[];

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {
    // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
