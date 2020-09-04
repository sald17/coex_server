import { Entity } from '@loopback/repository';
import { Room } from './room.model';
export declare class CoWorking extends Entity {
    id?: string;
    name?: string;
    about?: string;
    phone?: string;
    photo?: string[];
    address?: string;
    location?: number[];
    userId: string;
    rooms: Room[];
    constructor(data?: Partial<CoWorking>);
}
export interface CoWorkingRelations {
}
export declare type CoWorkingWithRelations = CoWorking & CoWorkingRelations;
