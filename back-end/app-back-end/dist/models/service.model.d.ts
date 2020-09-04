import { Entity } from '@loopback/repository';
export declare class Service extends Entity {
    id?: string;
    wifi?: boolean;
    conversionCall?: boolean;
    drink?: boolean;
    printer?: boolean;
    airCondition?: boolean;
    other?: string[];
    roomId: string;
    constructor(data?: Partial<Service>);
}
export interface ServiceRelations {
}
export declare type ServiceWithRelations = Service & ServiceRelations;
