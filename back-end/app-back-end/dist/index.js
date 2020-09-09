"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.startApplication = exports.setupApplication = exports.setUpServerConfig = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const server_1 = require("./server");
tslib_1.__exportStar(require("./application"), exports);
tslib_1.__exportStar(require("./server"), exports);
const ngrok = require('ngrok');
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
    const url = await ngrok.connect(3000);
    await ngrok.authtoken('1W9VTjQHduDqZV8y7gRI0tk3UBS_3ScbmHjugJNE3pF9S6eCN');
    console.log(`Server is running at ${url}`);
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