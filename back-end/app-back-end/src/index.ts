import {RestApplication} from '@loopback/rest';
import * as path from 'path';
import {ApplicationConfig, ExpressServer} from './server';
export * from './application';
export * from './server';
const ngrok = require('ngrok');
export async function setUpServerConfig(
    oauth2Providers: any,
): Promise<ApplicationConfig> {
    const config = {
        rest: {
            port: +(process.env.PORT ?? 3000),
            host: process.env.HOST,

            gracePeriodForClose: 5000, // 5 seconds
            openApiSpec: {
                setServersFromRequest: true,
            },
            // Use the LB4 application as a route. It should not be listening.
            listenOnStart: false,
        },
    };
    return config;
}

export async function setupApplication(
    loobackApp: RestApplication,
    dbBackUpFile?: string,
) {
    loobackApp.bind('datasources.config.db').to({
        name: 'db',
        connector: 'memory',
        localStorage: '',
        file: dbBackUpFile ? path.resolve(__dirname, dbBackUpFile) : undefined,
    });
}

export async function startApplication(
    oauth2Providers: any,
    dbBackupFile?: string,
): Promise<ExpressServer> {
    let config = await setUpServerConfig(oauth2Providers);
    let server = new ExpressServer(config);
    await setupApplication(server.loopbackApp, dbBackupFile);
    await server.boot();
    await server.start();

    const url = await ngrok.connect(3000);
    await ngrok.authtoken('1W9VTjQHduDqZV8y7gRI0tk3UBS_3ScbmHjugJNE3pF9S6eCN');
    console.log(`Server is running at ${url}`);

    return server;
}

export async function main() {
    let oauth2Providers;
    if (process.env.OAUTH_PROVIDERS_LOCATION) {
        oauth2Providers = require(process.env.OAUTH_PROVIDERS_LOCATION);
    } else {
        oauth2Providers = require('@loopback/mock-oauth2-provider');
    }

    const server: ExpressServer = await startApplication(
        oauth2Providers,
        process.env.DB_BKP_FILE_PATH, // eg: export DB_BKP_FILE_PATH=../data/db.json
    );
    return server;
}

if (require.main === module) {
    main().catch(err => {
        console.error('Cannot start the application.', err);
        process.exit(1);
    });
}
