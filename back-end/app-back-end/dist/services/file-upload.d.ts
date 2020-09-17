/// <reference types="express" />
import { Request, Response } from '@loopback/rest';
export declare function parseRequest(request: Request, response: Response): Promise<object>;
export declare const checkExistStorage: () => void;
export declare function saveFiles(files: any[]): Promise<string[] | {
    error: boolean;
    message: string;
}>;
export declare function deleteFiles(files: Array<any>): Promise<void>;
