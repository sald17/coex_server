import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Booking} from './booking.model';

@model()
export class Transaction extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'number',
        required: true,
    })
    price: number;

    @property({
        type: 'date',
        default: new Date(),
        required: true,
    })
    createdAt: Date;

    @property({
        type: 'date',
        default: new Date(),
    })
    modifiedAt: Date;

    @property({
        type: 'boolean',
        required: true,
        default: false,
    })
    checkIn: boolean;

    @property({
        type: 'boolean',
        default: false,
        required: true,
    })
    checkOut: boolean;

    @property({
        type: 'date',
    })
    checkInTime: Date;

    @property({
        type: 'date',
    })
    checkOutTime: Date;

    @property({
        type: 'number',
        default: 0,
    })
    earnPoint: number;

    @property({
        type: 'string',
        required: true,
    })
    bookingRefernce: string;

    @property({
        type: 'boolean',
        required: true,
        default: false,
    })
    payment: boolean;

    @belongsTo(() => Booking, {name: 'booking'})
    bookingId: string;

    constructor(data?: Partial<Transaction>) {
        super(data);
    }
}

export interface TransactionRelations {
    // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
