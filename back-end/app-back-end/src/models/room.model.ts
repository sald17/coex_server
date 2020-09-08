import {
    belongsTo,
    Entity,
    hasMany,
    hasOne,
    model,
    property,
} from '@loopback/repository';
import {Booking} from './booking.model';
import {CoWorking} from './co-working.model';
import {Service} from './service.model';

@model()
export class Room extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'string',
    })
    name?: string;

    @property({
        type: 'string',
    })
    about?: string;

    @property({
        type: 'number',
        require: true,
    })
    price: number;

    @property({
        type: 'number',
        require: true,
    })
    maxPerson: number;

    @property({
        type: 'array',
        itemType: 'string',
        default: [],
    })
    photo: string[];

    @property({
        type: 'date',
        default: Date(),
    })
    createdAt: Date;

    @property({
        type: 'date',
        default: Date(),
    })
    modifiedAt: Date;

    @hasOne(() => Service)
    service: Service;

    @hasMany(() => Booking)
    bookings: Booking[];

    @belongsTo(() => CoWorking)
    coWorkingId: string;

    constructor(data?: Partial<Room>) {
        super(data);
    }
}

export interface RoomRelations {
    // describe navigational properties here
}

export type RoomWithRelations = Room & RoomRelations;
