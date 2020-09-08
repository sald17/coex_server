/// <reference types="node" />
import { ApplicationConfig } from '@loopback/core';
import express from 'express';
import https from 'https';
import { AppApplication } from './application';
export { ApplicationConfig };
export declare class ExpressServer {
    expressApp: express.Application;
    readonly loopbackApp: AppApplication;
    server?: https.Server;
    url: String;
    constructor(options?: ApplicationConfig);
    boot(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
