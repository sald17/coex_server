import {AuthenticationComponent} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
    RestExplorerBindings,
    RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {LocalAuthStrategy} from './authorization/strategies';
import {JWTStrategy} from './authorization/strategies/jwt';
import {
    JwtServiceBindings,
    JwtServiceConstants,
    PasswordHasherBindings,
    UserServiceBindings,
} from './config/key';
import {MySequence} from './sequence';
import {JwtService} from './services/jwt.service';
import {PassportService} from './services/passport.service';
import {PasswordHasherService} from './services/password-hasher.service';

export {ApplicationConfig};

export class AppApplication extends BootMixin(
    ServiceMixin(RepositoryMixin(RestApplication)),
) {
    constructor(options: ApplicationConfig = {}) {
        super(options);

        this.setUpBindings();

        // Set up the custom sequence
        this.sequence(MySequence);
        this.component(AuthenticationComponent);

        // Set up default home page
        this.static('/', path.join(__dirname, '../public'));

        // Customize @loopback/rest-explorer configuration here
        this.configure(RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(RestExplorerComponent);

        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }

    setUpBindings(): void {
        this.bind(JwtServiceBindings.SECRET_KEY).to(
            JwtServiceConstants.SECRET_KEY,
        );
        this.bind(JwtServiceBindings.TOKEN_EXPIRES_IN).to(
            JwtServiceConstants.EXPIRES_VALUE,
        );
        this.bind(JwtServiceBindings.TOKEN_SERVICE).toClass(JwtService);

        this.bind(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(
            PassportService,
        );

        this.bind(PasswordHasherBindings.ROUNDS).to(10);
        this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(
            PasswordHasherService,
        );

        this.add(createBindingFromClass(LocalAuthStrategy));
        this.add(createBindingFromClass(JWTStrategy));
    }
}
