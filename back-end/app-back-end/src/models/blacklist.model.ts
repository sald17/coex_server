import {Entity, model, property} from '@loopback/repository';
import {Token} from './token.model';

@model()
export class Blacklist extends Entity {
    @property.array(Token)
    list?: Token[];

    constructor(data?: Partial<Blacklist>) {
        super(data);
    }
}

export interface BlacklistRelations {
    // describe navigational properties here
}

export type BlacklistWithRelations = Blacklist & BlacklistRelations;
