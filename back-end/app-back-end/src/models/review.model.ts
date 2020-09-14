import {belongsTo, Entity, model, property} from '@loopback/repository';
import {CoWorking} from './co-working.model';
import {User} from './user.model';

@model()
export class Review extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'string',
        required: true,
    })
    content: string;

    @property({
        type: 'number',
        required: true,
    })
    star: number;

    @property({
        type: 'date',
        required: true,
    })
    createdAt: Date;

    @property({
        type: 'date',
        required: true,
    })
    modifiedAt: Date;

    @belongsTo(() => User)
    userId: string;

    @belongsTo(() => CoWorking)
    coWorkingId: string;

    constructor(data?: Partial<Review>) {
        super(data);
    }
}

export interface ReviewRelations {
    // describe navigational properties here
}

export type ReviewWithRelations = Review & ReviewRelations;
