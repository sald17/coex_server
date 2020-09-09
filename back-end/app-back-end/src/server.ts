import {ApplicationConfig} from '@loopback/core';
import {once} from 'events';
import express from 'express';
import http from 'http';
import {AddressInfo} from 'net';
import * as path from 'path';
import {AppApplication} from './application';

export {ApplicationConfig};

export class ExpressServer {
    public expressApp: express.Application;
    public readonly loopbackApp: AppApplication;
    public server?: http.Server;
    public url: String;

    constructor(options: ApplicationConfig = {}) {
        this.expressApp = require('../web-application/express-server.js');
        this.loopbackApp = new AppApplication(options);

        this.expressApp.use(
            express.static(path.resolve(__dirname, '../public')),
            express.static(path.resolve(__dirname, '../storage')),
        );

        this.expressApp.use('/api', this.loopbackApp.requestHandler);
    }

    public async boot() {
        await this.loopbackApp.boot();
    }

    public async start() {
        await this.loopbackApp.start();
        const port = this.loopbackApp.restServer.config.port ?? 3000;
        const host = this.loopbackApp.restServer.config.host ?? 'localhost';
        this.server = http.createServer(this.expressApp).listen(port);
        await once(this.server, 'listening');

        const add = <AddressInfo>this.server.address();
    }

    public async stop() {
        if (!this.server) return;
        await this.loopbackApp.stop();
        this.server.close();
        await once(this.server, 'close');
        this.server = undefined;
    }
}
