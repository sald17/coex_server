import { Entity } from '@loopback/repository';
import { Service } from './service.model';
export declare class Room extends Entity {
    id?: string;
    name?: string;
    about?: string;
    price?: number;
    maxPerson?: number;
    photo: string[];
    coWorkingId?: string;
    service: Service;
    constructor(data?: Partial<Room>);
}
export interface RoomRelations {
}
export declare type RoomWithRelations = Room & RoomRelations;
