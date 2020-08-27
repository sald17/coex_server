/// <reference types="qs" />
import { TokenService, UserIdentityService, UserService } from '@loopback/authentication';
import { BindingKey } from '@loopback/core';
import { RequestHandler } from 'express-serve-static-core';
import { Profile as PassportProfile } from 'passport';
import { User } from '../models';
import { EmailService } from '../services/email.service';
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
export declare namespace EmailServiceBindings {
    const EMAIL_SERVICE: BindingKey<EmailService>;
}
/**
 * Binding key for the file upload service
 */
export declare const FILE_UPLOAD_SERVICE: BindingKey<RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>>;
/**
 * Binding key for the storage directory
 */
export declare const STORAGE_DIRECTORY: BindingKey<string>;
