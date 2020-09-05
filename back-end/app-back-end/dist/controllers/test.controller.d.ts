import { Request, Response } from '@loopback/rest';
import { RequestHandler } from 'express';
import { BlacklistRepository } from '../repositories';
import { JwtService } from '../services';
import { EmailService } from '../services/email.service';
export declare class TestController {
    private blacklist;
    private emailService;
    private uploadFileService;
    private jwtService;
    constructor(blacklist: BlacklistRepository, emailService: EmailService, uploadFileService: RequestHandler, jwtService: JwtService);
    sendEmail(): Promise<any>;
    generateToken(value: string): Promise<string>;
    testRedis(token: string): Promise<{
        token: any;
        expTime: any;
    }>;
    fileUpload(request: Request, response: Response): Promise<object>;
    testMessage(): Promise<string>;
    testFile(request: Request, response: Response): Promise<void>;
}
