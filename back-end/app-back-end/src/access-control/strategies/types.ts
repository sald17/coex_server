import {securityId, UserProfile} from '@loopback/security';
import {User} from '../../models';

export const mapProfile = (user: User): UserProfile => {
    return {
        [securityId]: user.id + '',
        profile: {...user},
    };
};
