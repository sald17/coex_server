import { UserIdentityService } from '@loopback/authentication';
import { Profile as PassportProfile } from 'passport';
import { User } from '../models';
import { UserRepository } from '../repositories';
export declare class PassportService implements UserIdentityService<PassportProfile, User> {
    constructor(userRepository: UserRepository);
    findOrCreateUser(profile: PassportProfile): Promise<User>;
    linkExternalProfile(userId: string, userIdentity: PassportProfile): Promise<User>;
}
