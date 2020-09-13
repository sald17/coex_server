"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppApplication = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const boot_1 = require("@loopback/boot");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_explorer_1 = require("@loopback/rest-explorer");
const service_proxy_1 = require("@loopback/service-proxy");
const admin = tslib_1.__importStar(require("firebase-admin"));
const path_1 = tslib_1.__importDefault(require("path"));
const authorization_2 = require("./access-control/interceptor/authorization");
const user_account_interceptor_1 = require("./access-control/interceptor/user-account-interceptor");
const jwt_1 = require("./access-control/strategies/jwt");
const key_1 = require("./config/key");
const cronjob_1 = require("./cronjob");
const sequence_1 = require("./sequence");
const services_1 = require("./services");
const email_service_1 = require("./services/email.service");
const jwt_service_1 = require("./services/jwt.service");
const password_hasher_service_1 = require("./services/password-hasher.service");
const firebaseCredential = require('../src/config/firebase.json');
class AppApplication extends boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        this.setUpBindings();
        admin.initializeApp({
            credential: admin.credential.cert(firebaseCredential),
            databaseURL: 'https://fir-token-e3a3b.firebaseio.com',
        });
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        this.component(authentication_1.AuthenticationComponent);
        this.component(authorization_1.AuthorizationComponent);
        // this.component(CronComponent);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // Customize @loopback/rest-explorer configuration here
        this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(rest_explorer_1.RestExplorerComponent);
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
        //Bind JWT service
        this.bind(key_1.JwtServiceBindings.SECRET_KEY).to(key_1.JwtServiceConstants.SECRET_KEY);
        this.bind(key_1.JwtServiceBindings.TOKEN_EXPIRES_IN).to(key_1.JwtServiceConstants.EXPIRES_VALUE);
        this.bind(key_1.JwtServiceBindings.TOKEN_SERVICE).toClass(jwt_service_1.JwtService);
        // Bind email service
        this.bind(key_1.EmailServiceBindings.EMAIL_SERVICE).toClass(email_service_1.EmailService);
        // Bind password service
        this.bind(key_1.PasswordHasherBindings.ROUNDS).to(10);
        this.bind(key_1.PasswordHasherBindings.PASSWORD_HASHER).toClass(password_hasher_service_1.PasswordHasherService);
        // User acc interceptor
        this.bind(user_account_interceptor_1.UserAccountInterceptor.BINDING_KEY).toProvider(user_account_interceptor_1.UserAccountInterceptor);
        //Bind authorization
        this.bind(authorization_2.AuthorizationProvider.BINDING_KEY).toProvider(authorization_2.AuthorizationProvider);
        //Bind cron job
        this.add(core_1.createBindingFromClass(cronjob_1.BlacklistCron));
        // Bind strategy
        this.add(core_1.createBindingFromClass(jwt_1.JWTStrategy));
        //Bind passport service
        this.bind(key_1.UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(services_1.PassportService);
        // Bind coin service
        this.bind(key_1.COIN_SERVICE).toClass(services_1.CoinService);
    }
    setUpAuthorization() {
        const option = {
        // precedence
        };
    }
}
exports.AppApplication = AppApplication;
//# sourceMappingURL=application.js.map