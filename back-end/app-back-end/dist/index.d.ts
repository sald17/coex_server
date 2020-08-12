import { RestApplication } from '@loopback/rest';
import { ApplicationConfig, ExpressServer } from './server';
export * from './application';
export * from './server';
export declare function setUpServerConfig(oauth2Providers: any): Promise<ApplicationConfig>;
export declare function setupApplication(loobackApp: RestApplication, dbBackUpFile?: string): Promise<void>;
export declare function startApplication(oauth2Providers: any, dbBackupFile?: string): Promise<ExpressServer>;
export declare function main(): Promise<ExpressServer>;
