import { Entity } from '@loopback/repository';
import { ThirdPartyIdentity } from './third-party-identity.model';
export declare class User extends Entity {
    id?: string;
    fullname?: string;
    gender?: string;
    birth?: string;
    phoneNumber?: string;
    email: string;
    emailVerified?: boolean;
    address?: string;
    createdAt?: string;
    modifiedAt?: string;
    avatar?: string;
    username: string;
    password: string;
    role: string[];
    identities?: ThirdPartyIdentity[];
    constructor(data?: Partial<User>);
}
export interface UserRelations {
}
export declare type UserWithRelations = User & UserRelations;
