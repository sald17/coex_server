import { Request, Response } from '@loopback/rest';
import { RequestHandler } from 'express';
import { EmailService } from '../services/email.service';
export declare class TestController {
    emailService: EmailService;
    uploadFileService: RequestHandler;
    constructor(emailService: EmailService, uploadFileService: RequestHandler);
    sendEmail(): Promise<void>;
    fileUpload(request: Request, response: Response): Promise<object>;
    testMessage(): Promise<string>;
}
