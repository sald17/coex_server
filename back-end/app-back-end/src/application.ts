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
import multer from 'multer';
import path from 'path';
import {UserAccountInterceptor} from './authorization/interceptor/user-account-interceptor';
import {LocalAuthStrategy} from './authorization/strategies';
import {JWTStrategy} from './authorization/strategies/jwt';
import {
    EmailServiceBindings,
    FILE_UPLOAD_SERVICE,
    JwtServiceBindings,
    JwtServiceConstants,
    PasswordHasherBindings,
    STORAGE_DIRECTORY,
    UserServiceBindings,
} from './config/key';
import {BlacklistCron} from './cronjob';
import {MySequence} from './sequence';
import {EmailService} from './services/email.service';
import {FileUploadProvider} from './services/file-upload';
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

        // this.component(CronComponent);

        // Set up default home page
        this.static('/', path.join(__dirname, '../public'));

        // Customize @loopback/rest-explorer configuration here
        this.configure(RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(RestExplorerComponent);

        this.configureFileUpload();

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

        this.bind(EmailServiceBindings.EMAIL_SERVICE).toClass(EmailService);

        this.bind(PasswordHasherBindings.ROUNDS).to(10);
        this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(
            PasswordHasherService,
        );
        this.bind(UserAccountInterceptor.BINDING_KEY).toProvider(
            UserAccountInterceptor,
        );

        this.add(createBindingFromClass(BlacklistCron));

        this.add(createBindingFromClass(LocalAuthStrategy));
        this.add(createBindingFromClass(JWTStrategy));
    }

    protected configureFileUpload(destination?: string) {
        // Upload files to `dist/.sandbox` by default
        // const homedir = os.homedir();
        destination = path.join(__dirname, '../storage');
        console.log(destination);
        this.bind(STORAGE_DIRECTORY).to(destination);
        const multerOptions: multer.Options = {
            storage: multer.diskStorage({
                destination,
                // Use the original file name as is
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            }),
        };
        // Configure the file upload service with multer options
        this.bind(FILE_UPLOAD_SERVICE).toProvider(FileUploadProvider);
        this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
    }
}
