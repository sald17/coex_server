import { Entity } from '@loopback/repository';
import { Review } from './review.model';
import { Room } from './room.model';
export declare class CoWorking extends Entity {
    id?: string;
    name?: string;
    about?: string;
    phone?: string;
    photo: string[];
    address?: string;
    location?: number[];
    starRating: number[];
    totalRating: number;
    createdAt: Date;
    modifiedAt: Date;
    userId: string;
    rooms: Room[];
    reviews: Review[];
    constructor(data?: Partial<CoWorking>);
}
export interface CoWorkingRelations {
}
export declare type CoWorkingWithRelations = CoWorking & CoWorkingRelations;
