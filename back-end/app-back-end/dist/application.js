"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppApplication = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const boot_1 = require("@loopback/boot");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_explorer_1 = require("@loopback/rest-explorer");
const service_proxy_1 = require("@loopback/service-proxy");
const multer_1 = tslib_1.__importDefault(require("multer"));
const path_1 = tslib_1.__importDefault(require("path"));
const user_account_interceptor_1 = require("./authorization/interceptor/user-account-interceptor");
const strategies_1 = require("./authorization/strategies");
const jwt_1 = require("./authorization/strategies/jwt");
const key_1 = require("./config/key");
const cronjob_1 = require("./cronjob");
const sequence_1 = require("./sequence");
const email_service_1 = require("./services/email.service");
const file_upload_1 = require("./services/file-upload");
const jwt_service_1 = require("./services/jwt.service");
const passport_service_1 = require("./services/passport.service");
const password_hasher_service_1 = require("./services/password-hasher.service");
class AppApplication extends boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        this.setUpBindings();
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        this.component(authentication_1.AuthenticationComponent);
        // this.component(CronComponent);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // Customize @loopback/rest-explorer configuration here
        this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(rest_explorer_1.RestExplorerComponent);
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
    setUpBindings() {
        this.bind(key_1.JwtServiceBindings.SECRET_KEY).to(key_1.JwtServiceConstants.SECRET_KEY);
        this.bind(key_1.JwtServiceBindings.TOKEN_EXPIRES_IN).to(key_1.JwtServiceConstants.EXPIRES_VALUE);
        this.bind(key_1.JwtServiceBindings.TOKEN_SERVICE).toClass(jwt_service_1.JwtService);
        this.bind(key_1.UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(passport_service_1.PassportService);
        this.bind(key_1.EmailServiceBindings.EMAIL_SERVICE).toClass(email_service_1.EmailService);
        this.bind(key_1.PasswordHasherBindings.ROUNDS).to(10);
        this.bind(key_1.PasswordHasherBindings.PASSWORD_HASHER).toClass(password_hasher_service_1.PasswordHasherService);
        this.bind(user_account_interceptor_1.UserAccountInterceptor.BINDING_KEY).toProvider(user_account_interceptor_1.UserAccountInterceptor);
        this.add(core_1.createBindingFromClass(cronjob_1.BlacklistCron));
        this.add(core_1.createBindingFromClass(strategies_1.LocalAuthStrategy));
        this.add(core_1.createBindingFromClass(jwt_1.JWTStrategy));
    }
    configureFileUpload(destination) {
        // Upload files to `dist/.sandbox` by default
        // const homedir = os.homedir();
        destination = path_1.default.join(__dirname, '../storage');
        console.log(destination);
        this.bind(key_1.STORAGE_DIRECTORY).to(destination);
        const multerOptions = {
            storage: multer_1.default.diskStorage({
                destination,
                // Use the original file name as is
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            }),
        };
        // Configure the file upload service with multer options
        this.bind(key_1.FILE_UPLOAD_SERVICE).toProvider(file_upload_1.FileUploadProvider);
        this.configure(key_1.FILE_UPLOAD_SERVICE).to(multerOptions);
    }
}
exports.AppApplication = AppApplication;
//# sourceMappingURL=application.js.map