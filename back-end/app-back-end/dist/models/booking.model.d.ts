import { Entity } from '@loopback/repository';
import { Transaction } from './transaction.model';
export declare class Booking extends Entity {
    id: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    numPerson: number;
    status?: string;
    createdAt: Date;
    modifiedAt: Date;
    userId: string;
    roomId: string;
    transaction: Transaction;
    constructor(data?: Partial<Booking>);
}
export interface BookingRelations {
}
export declare type BookingWithRelations = Booking & BookingRelations;
