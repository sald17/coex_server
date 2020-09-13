import {
    TokenService,
    UserIdentityService,
    UserService,
} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {RequestHandler} from 'express-serve-static-core';
import {Profile as PassportProfile} from 'passport';
import {AuthorizationProvider} from '../access-control/interceptor/authorization';
import {User} from '../models';
import {CoinService} from '../services';
import {EmailService} from '../services/email.service';
import {PasswordHasher} from '../services/password-hasher.service';

export namespace JwtServiceConstants {
    export const SECRET_KEY = 'secretKey';
    export const EXPIRES_VALUE = 60 * 10; //secs
}

export namespace JwtServiceBindings {
    export const SECRET_KEY = BindingKey.create<string>(
        'authentication.jwt.secret',
    );
    export const TOKEN_EXPIRES_IN = BindingKey.create<number>(
        'authentication.jwt.expires.in.seconds',
    );
    export const TOKEN_SERVICE = BindingKey.create<TokenService>(
        'services.authentication.jwt.tokenservice',
    );
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

export namespace EmailServiceBindings {
    export const EMAIL_SERVICE = BindingKey.create<EmailService>(
        'services.email',
    );
}

/**
 * Binding key for the file upload service
 */
export const FILE_UPLOAD_SERVICE = BindingKey.create<RequestHandler>(
    'services.FileUpload',
);

export const COIN_SERVICE = BindingKey.create<CoinService>('services.coin');

/**
 * Binding key for the storage directory
 */
export const STORAGE_DIRECTORY = BindingKey.create<string>('storage.directory');
export const RESOURCE_ID = BindingKey.create<string>('resourceId');
export const AUTHORIZATION_SERVICE = BindingKey.create<AuthorizationProvider>(
    'authorizationProviders.my-provider',
);
