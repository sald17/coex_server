import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {bind, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {IVerifyOptions, Strategy} from 'passport-local';
import {PasswordHasherBindings} from '../../config/key';
import {User} from '../../models';
import {UserRepository} from '../../repositories';
import {PasswordHasherService} from '../../services/password-hasher.service';
import {mapProfile} from './types';

@bind(asAuthStrategy)
export class LocalAuthStrategy implements AuthenticationStrategy {
    name = 'local';
    passportStrategy: Strategy;
    strategy: StrategyAdapter<User>;
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasherService,
    ) {
        this.passportStrategy = new Strategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            this.verify.bind(this),
        );

        this.strategy = new StrategyAdapter(
            this.passportStrategy,
            this.name,
            mapProfile.bind(this),
        );
    }

    async authenticate(request: Request): Promise<UserProfile | RedirectRoute> {
        return await this.strategy.authenticate(request);
    }

    async verify(
        email: string,
        password: string,
        done: (error: any, user?: any, options?: IVerifyOptions) => void,
    ) {
        const AUTH_FAILED_MESSAGE = 'Incorrect email or password.';
        const EMAIL_VERIFIED_FAILED_MESSAGE = 'Email not verified.';
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            return done(null, null, {message: AUTH_FAILED_MESSAGE});
        }
        if (!user?.emailVerified) {
            return done(null, null, {message: EMAIL_VERIFIED_FAILED_MESSAGE});
        }

        const isPasswordMatched = await this.passwordHasher.comparePassword(
            password,
            user.password,
        );
        if (!isPasswordMatched) {
            return done(null, null, {message: AUTH_FAILED_MESSAGE});
        }

        return done(null, user);
    }
}
