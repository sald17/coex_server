import { DefaultKeyValueRepository } from '@loopback/repository';
import { RedisConnectorDataSource } from '../datasources';
import { Blacklist } from '../models';
export declare class BlacklistRepository extends DefaultKeyValueRepository<Blacklist> {
    connector: import("loopback-datasource-juggler").Connector;
    execute: (arg1: string, arg2: any[]) => Promise<unknown>;
    constructor(dataSource: RedisConnectorDataSource);
    addToken(token: string): Promise<void>;
    getBlacklist(): Promise<any>;
    checkToken(token: string): Promise<unknown>;
    cleanBlacklist(): Promise<void>;
    check(str: string): Promise<{
        token: any;
        expTime: any;
    }>;
    addOtp(email: string, otp: string): Promise<void>;
    checkOtp(email: string, otp: string): Promise<boolean>;
    deleteOtp(email: string): Promise<number>;
    convertByteToString(bufArr: []): any;
}
