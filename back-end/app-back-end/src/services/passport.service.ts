import {UserIdentityService} from '@loopback/authentication';
import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Profile as PassportProfile} from 'passport';
import {User} from '../models';
import {UserRepository} from '../repositories';
@bind({scope: BindingScope.TRANSIENT})
export class PassportService
    implements UserIdentityService<PassportProfile, User> {
    constructor(@repository(UserRepository) userRepository: UserRepository) {}
    async findOrCreateUser(profile: PassportProfile): Promise<User> {
        console.log(profile);
        throw new Error('Find or create user');
    }
    linkExternalProfile(
        userId: string,
        userIdentity: PassportProfile,
    ): Promise<User> {
        console.log(userId);
        console.log(userIdentity);
        throw new Error('Link external profile');
    }

    /*
     * Add service methods here
     */
}
