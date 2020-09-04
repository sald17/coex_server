import { Entity } from '@loopback/repository';
import { CoWorking } from './co-working.model';
export declare class User extends Entity {
    id?: string;
    fullname?: string;
    birth?: string;
    phoneNumber?: string;
    email: string;
    emailVerified?: boolean;
    address?: string;
    createdAt?: string;
    modifiedAt?: string;
    avatar?: string;
    password: string;
    token: string[];
    firebaseToken: string[];
    role: string[];
    coWorking: CoWorking;
    constructor(data?: Partial<User>);
}
export interface UserRelations {
}
export declare type UserWithRelations = User & UserRelations;
