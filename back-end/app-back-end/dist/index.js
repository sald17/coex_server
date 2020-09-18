"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.startApplication = exports.setupApplication = exports.setUpServerConfig = void 0;
const tslib_1 = require("tslib");
const agenda_1 = tslib_1.__importDefault(require("agenda"));
const path = tslib_1.__importStar(require("path"));
const server_1 = require("./server");
const schedule_service_1 = require("./services/schedule.service");
tslib_1.__exportStar(require("./application"), exports);
tslib_1.__exportStar(require("./server"), exports);
const db = require('../src/datasources/mongodb-config.json');
const ngrok = require('ngrok');
const mongoDbURL = `mongodb://${db.user + (db.user != '' ? ':' : '')}${db.password + (db.user != '' ? '@' : '')}${db.host}:${db.port}/${db.database}`;
async function setUpServerConfig(oauth2Providers) {
    var _a;
    const config = {
        rest: {
            port: +((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000),
            host: process.env.HOST,
            gracePeriodForClose: 5000,
            openApiSpec: {
                setServersFromRequest: true,
            },
            // Use the LB4 application as a route. It should not be listening.
            listenOnStart: false,
        },
    };
    return config;
}
exports.setUpServerConfig = setUpServerConfig;
async function setupApplication(loobackApp, dbBackUpFile) {
    loobackApp.bind('datasources.config.db').to({
        name: 'db',
        connector: 'memory',
        localStorage: '',
        file: dbBackUpFile ? path.resolve(__dirname, dbBackUpFile) : undefined,
    });
}
exports.setupApplication = setupApplication;
async function startApplication(oauth2Providers, dbBackupFile) {
    let config = await setUpServerConfig(oauth2Providers);
    let server = new server_1.ExpressServer(config);
    await setupApplication(server.loopbackApp, dbBackupFile);
    await server.boot();
    await server.start();
    //Set up agenda
    schedule_service_1.ScheduleService.agenda = new agenda_1.default({
        db: {
            address: mongoDbURL,
            options: { useNewUrlParser: true, useUnifiedTopology: true },
        },
    });
    await schedule_service_1.ScheduleService.agenda.on('ready', async () => {
        let schedule = new schedule_service_1.ScheduleService(server.loopbackApp.getSync('repositories.UserRepository'), server.loopbackApp.getSync('repositories.BookingRepository'), server.loopbackApp.getSync('repositories.TransactionRepository'));
        schedule_service_1.ScheduleService.agenda.schedule('in 5 seconds', 'test', {});
        schedule_service_1.ScheduleService.agenda.start();
        console.log('Start agenda.');
    });
    console.log('Server started');
    // const url = await ngrok.connect(3000);
    // await ngrok.authtoken('1W9VTjQHduDqZV8y7gRI0tk3UBS_3ScbmHjugJNE3pF9S6eCN');
    // console.log(`Server is running at ${url}`);
    return server;
}
exports.startApplication = startApplication;
async function main() {
    let oauth2Providers;
    if (process.env.OAUTH_PROVIDERS_LOCATION) {
        oauth2Providers = require(process.env.OAUTH_PROVIDERS_LOCATION);
    }
    else {
        oauth2Providers = require('@loopback/mock-oauth2-provider');
    }
    const server = await startApplication(oauth2Providers, process.env.DB_BKP_FILE_PATH);
    return server;
}
exports.main = main;
if (require.main === module) {
    main().catch(err => {
        console.error('Cannot start the application.', err);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map