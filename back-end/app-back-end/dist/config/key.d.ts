import { TokenService, UserIdentityService, UserService } from '@loopback/authentication';
import { BindingKey } from '@loopback/core';
import { Profile as PassportProfile } from 'passport';
import { User } from '../models';
import { PasswordHasher } from '../services/password-hasher.service';
export declare namespace JwtServiceConstants {
    const SECRET_KEY = "secretKey";
    const EXPIRES_VALUE = "10000";
}
export declare namespace PasswordHasherBindings {
    const PASSWORD_HASHER: BindingKey<PasswordHasher<string>>;
    const ROUNDS: BindingKey<number>;
}
export declare namespace PassportAuthenticationServiceBindings {
    const OAUTH2_STRATEGY = "passport.authentication.oauth2.strategy";
}
export declare namespace UserServiceBindings {
    const USER_SERVICE: BindingKey<UserService<User, User>>;
    const PASSPORT_USER_IDENTITY_SERVICE: BindingKey<UserIdentityService<PassportProfile, User>>;
}
export declare namespace JwtServiceBindings {
    const SECRET_KEY: BindingKey<string>;
    const TOKEN_EXPIRES_IN: BindingKey<string>;
    const TOKEN_SERVICE: BindingKey<TokenService>;
}
