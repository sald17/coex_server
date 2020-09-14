import { Entity } from '@loopback/repository';
export declare class Review extends Entity {
    id?: string;
    content: string;
    star: number;
    createdAt: Date;
    modifiedAt: Date;
    userId: string;
    coWorkingId: string;
    constructor(data?: Partial<Review>);
}
export interface ReviewRelations {
}
export declare type ReviewWithRelations = Review & ReviewRelations;
