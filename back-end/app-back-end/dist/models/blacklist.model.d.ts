import { Entity } from '@loopback/repository';
import { Token } from './token.model';
export declare class Blacklist extends Entity {
    list?: Token[];
    constructor(data?: Partial<Blacklist>);
}
export interface BlacklistRelations {
}
export declare type BlacklistWithRelations = Blacklist & BlacklistRelations;
