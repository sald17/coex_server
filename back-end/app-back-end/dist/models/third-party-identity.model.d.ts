import { Entity } from '@loopback/repository';
export declare class ThirdPartyIdentity extends Entity {
    id?: string;
    provider?: string;
    profile?: object;
    createdAt?: string;
    modifiedAt?: string;
    userId?: string;
    constructor(data?: Partial<ThirdPartyIdentity>);
}
export interface ThirdPartyIdentityRelations {
}
export declare type ThirdPartyIdentityWithRelations = ThirdPartyIdentity & ThirdPartyIdentityRelations;
