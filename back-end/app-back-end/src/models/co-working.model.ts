import {
    belongsTo,
    Entity,
    hasMany,
    model,
    property,
} from '@loopback/repository';
import {Review} from './review.model';
import {Room} from './room.model';
import {User} from './user.model';

@model()
export class CoWorking extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'string',
    })
    name?: string;

    @property({
        type: 'string',
    })
    about?: string;

    @property({
        type: 'string',
    })
    phone?: string;

    @property({
        type: 'array',
        itemType: 'string',
        default: [],
    })
    photo: string[];

    @property({
        type: 'string',
    })
    address?: string;

    @property({
        type: 'array',
        itemType: 'number',
    })
    location?: number[];

    @property({
        type: 'array',
        itemType: 'number',
        default: [0, 0, 0, 0, 0],
    })
    starRating: number[];

    @property({
        type: 'number',
    })
    totalRating: number;

    @property({
        type: 'date',
        default: Date(),
    })
    createdAt: Date;

    @property({
        type: 'date',
        default: Date(),
    })
    modifiedAt: Date;

    @belongsTo(() => User)
    userId: string;

    @hasMany(() => Room)
    rooms: Room[];

    @hasMany(() => Review)
    reviews: Review[];

    constructor(data?: Partial<CoWorking>) {
        super(data);
    }
}

export interface CoWorkingRelations {
    // describe navigational properties here
}

export type CoWorkingWithRelations = CoWorking & CoWorkingRelations;
