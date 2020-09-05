import {Entity, hasOne, model, property} from '@loopback/repository';
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
    })
    price?: number;

    @property({
        type: 'number',
    })
    maxPerson?: number;

    @property({
        type: 'array',
        itemType: 'string',
    })
    photo: string[];

    @property({
        type: 'string',
    })
    coWorkingId?: string;

    @hasOne(() => Service)
    service: Service;

    constructor(data?: Partial<Room>) {
        super(data);
    }
}

export interface RoomRelations {
    // describe navigational properties here
}

export type RoomWithRelations = Room & RoomRelations;
