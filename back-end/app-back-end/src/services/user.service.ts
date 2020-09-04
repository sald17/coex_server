import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {securityId, UserProfile} from '@loopback/security';

@bind({scope: BindingScope.TRANSIENT})
export class UserService {
    constructor(/* Add @inject to inject parameters */) {}

    /*
     * Add service methods here
     */
}

export const mapProfile = (user: any): UserProfile => {
    return {
        [securityId]: user.id + '',
        profile: {...user},
    };
};
