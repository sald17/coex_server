import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Room} from './room.model';

@model()
export class Service extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @property({
        type: 'boolean',
        default: false,
    })
    wifi?: boolean;

    @property({
        type: 'boolean',
        default: false,
    })
    conversionCall?: boolean;

    @property({
        type: 'boolean',
        default: false,
    })
    drink?: boolean;

    @property({
        type: 'boolean',
        default: false,
    })
    printer?: boolean;

    @property({
        type: 'boolean',
        default: false,
    })
    airCondition?: boolean;

    @property({
        type: 'array',
        itemType: 'string',
    })
    other?: string[];

    @belongsTo(() => Room)
    roomId: string;

    constructor(data?: Partial<Service>) {
        super(data);
    }
}

export interface ServiceRelations {
    // describe navigational properties here
}

export type ServiceWithRelations = Service & ServiceRelations;
