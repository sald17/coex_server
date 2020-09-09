/// <reference types="node" />
import { ApplicationConfig } from '@loopback/core';
import express from 'express';
import http from 'http';
import { AppApplication } from './application';
export { ApplicationConfig };
export declare class ExpressServer {
    expressApp: express.Application;
    readonly loopbackApp: AppApplication;
    server?: http.Server;
    url: String;
    constructor(options?: ApplicationConfig);
    boot(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
