/// <reference types="express" />
import { Provider } from '@loopback/core';
import { Request } from '@loopback/rest';
import { RequestHandler } from 'express-serve-static-core';
import multer from 'multer';
/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
export declare class FileUploadProvider implements Provider<RequestHandler> {
    private options;
    constructor(options?: multer.Options);
    value(): RequestHandler;
    static getFilesAndFields(request: Request): {
        files: object[];
        fields: any;
    };
}
