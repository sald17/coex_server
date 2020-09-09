import {belongsTo, Entity, hasOne, model, property} from '@loopback/repository';
import {BookingConstant} from '../config/constants';
import {Room} from './room.model';
import {Transaction} from './transaction.model';
import {User} from './user.model';
@model()
export class Booking extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id: string;

    @property({
        type: 'string',
        default: '',
    })
    description?: string;

    @property({
        type: 'date',
        required: true,
    })
    startTime: Date;

    @property({
        type: 'date',
        required: true,
    })
    endTime: Date;
    @property({
        type: 'number',
        require: true,
    })
    duration: number;

    @property({
        type: 'number',
        required: true,
        default: 0,
    })
    numPerson: number;

    @property({
        type: 'string',
        default: BookingConstant.PENDING,
    })
    status?: string;

    @property({
        type: 'date',
        default: new Date(),
    })
    createdAt: Date;

    @property({
        type: 'date',
        default: new Date(),
    })
    modifiedAt: Date;

    @belongsTo(() => User)
    userId: string;

    @belongsTo(() => Room)
    roomId: string;

    @hasOne(() => Transaction)
    transaction: Transaction;

    constructor(data?: Partial<Booking>) {
        super(data);
    }
}

export interface BookingRelations {
    // describe navigational properties here
}

export type BookingWithRelations = Booking & BookingRelations;
