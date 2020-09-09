"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const express_1 = tslib_1.__importDefault(require("express"));
const http_1 = tslib_1.__importDefault(require("http"));
const path = tslib_1.__importStar(require("path"));
const application_1 = require("./application");
class ExpressServer {
    constructor(options = {}) {
        this.expressApp = require('../web-application/express-server.js');
        this.loopbackApp = new application_1.AppApplication(options);
        this.expressApp.use(express_1.default.static(path.resolve(__dirname, '../public')), express_1.default.static(path.resolve(__dirname, '../storage')));
        this.expressApp.use('/api', this.loopbackApp.requestHandler);
    }
    async boot() {
        await this.loopbackApp.boot();
    }
    async start() {
        var _a, _b;
        await this.loopbackApp.start();
        const port = (_a = this.loopbackApp.restServer.config.port) !== null && _a !== void 0 ? _a : 3000;
        const host = (_b = this.loopbackApp.restServer.config.host) !== null && _b !== void 0 ? _b : 'localhost';
        this.server = http_1.default.createServer(this.expressApp).listen(port);
        await events_1.once(this.server, 'listening');
        const add = this.server.address();
    }
    async stop() {
        if (!this.server)
            return;
        await this.loopbackApp.stop();
        this.server.close();
        await events_1.once(this.server, 'close');
        this.server = undefined;
    }
}
exports.ExpressServer = ExpressServer;
//# sourceMappingURL=server.js.map