import { Entity } from '@loopback/repository';
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
    refreshToken: string;
    role: string[];
    constructor(data?: Partial<User>);
}
export interface UserRelations {
}
export declare type UserWithRelations = User & UserRelations;
