"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConnectorDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'RedisConnector',
    connector: 'kv-redis',
    url: '',
    // host: 'redis',
    host: 'localhost',
    port: 6379,
    password: '',
    db: 0,
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
let RedisConnectorDataSource = class RedisConnectorDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
RedisConnectorDataSource.dataSourceName = 'RedisConnector';
RedisConnectorDataSource.defaultConfig = config;
RedisConnectorDataSource = tslib_1.__decorate([
    core_1.lifeCycleObserver('datasource'),
    tslib_1.__param(0, core_1.inject('datasources.config.RedisConnector', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], RedisConnectorDataSource);
exports.RedisConnectorDataSource = RedisConnectorDataSource;
//# sourceMappingURL=redis-connector.datasource.js.map