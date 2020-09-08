import { Entity } from '@loopback/repository';
export declare class Transaction extends Entity {
    id?: string;
    price: number;
    createdAt: Date;
    modifiedAt: Date;
    checkIn: boolean;
    checkOut: boolean;
    checkInTime: Date;
    checkOutTime: Date;
    earnPoint: number;
    bookingRefernce: string;
    payment: boolean;
    bookingId: string;
    constructor(data?: Partial<Transaction>);
}
export interface TransactionRelations {
}
export declare type TransactionWithRelations = Transaction & TransactionRelations;
