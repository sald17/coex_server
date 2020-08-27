import { LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
export declare class RedisConnectorDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName: string;
    static readonly defaultConfig: {
        name: string;
        connector: string;
        url: string;
        host: string;
        port: number;
        password: string;
        db: number;
    };
    constructor(dsConfig?: object);
}
