/// <reference types="express" />
import { AuthenticationStrategy } from '@loopback/authentication';
import { StrategyAdapter } from '@loopback/authentication-passport';
import { RedirectRoute, Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { IVerifyOptions, Strategy } from 'passport-local';
import { User } from '../../models';
import { UserRepository } from '../../repositories';
import { PasswordHasherService } from '../../services/password-hasher.service';
export declare class LocalAuthStrategy implements AuthenticationStrategy {
    userRepository: UserRepository;
    passwordHasher: PasswordHasherService;
    name: string;
    passportStrategy: Strategy;
    strategy: StrategyAdapter<User>;
    constructor(userRepository: UserRepository, passwordHasher: PasswordHasherService);
    authenticate(request: Request): Promise<UserProfile | RedirectRoute>;
    verify(email: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void): Promise<void>;
}
