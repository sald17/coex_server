import {
    TokenService,
    UserIdentityService,
    UserService,
} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {Profile as PassportProfile} from 'passport';
import {User} from '../models';
import {EmailService} from '../services/email.service';
import {PasswordHasher} from '../services/password-hasher.service';

export namespace JwtServiceConstants {
    export const SECRET_KEY = 'secretKey';
    export const EXPIRES_VALUE = '10000';
}
export namespace PasswordHasherBindings {
    export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
        'services.hasher',
    );
    export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace PassportAuthenticationServiceBindings {
    export const OAUTH2_STRATEGY = 'passport.authentication.oauth2.strategy';
}
export namespace UserServiceBindings {
    export const USER_SERVICE = BindingKey.create<UserService<User, User>>(
        'services.user.service',
    );
    export const PASSPORT_USER_IDENTITY_SERVICE = BindingKey.create<
        UserIdentityService<PassportProfile, User>
    >('services.passport.identity');
}

export namespace JwtServiceBindings {
    export const SECRET_KEY = BindingKey.create<string>(
        'authentication.jwt.secret',
    );
    export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
        'authentication.jwt.expires.in.seconds',
    );
    export const TOKEN_SERVICE = BindingKey.create<TokenService>(
        'services.authentication.jwt.tokenservice',
    );
}

export namespace EmailServiceBindings {
    export const EMAIL_SERVICE = BindingKey.create<EmailService>(
        'services.email',
    );
}
