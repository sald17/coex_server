import { Entity } from '@loopback/repository';
import { Booking } from './booking.model';
import { Service } from './service.model';
export declare class Room extends Entity {
    id?: string;
    name?: string;
    about?: string;
    price: number;
    maxPerson: number;
    photo: string[];
    createdAt: Date;
    modifiedAt: Date;
    service: Service;
    bookings: Booking[];
    coWorkingId: string;
    constructor(data?: Partial<Room>);
}
export interface RoomRelations {
}
export declare type RoomWithRelations = Room & RoomRelations;
