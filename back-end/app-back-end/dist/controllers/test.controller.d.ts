import { BlacklistRepository } from '../repositories';
import { JwtService } from '../services';
import { EmailService } from '../services/email.service';
export declare class TestController {
    private blacklist;
    private emailService;
    private jwtService;
    constructor(blacklist: BlacklistRepository, emailService: EmailService, jwtService: JwtService);
    sendEmail(): Promise<any>;
    generateToken(value: string): Promise<string>;
    testRedis(token: string): Promise<{
        token: any;
        expTime: any;
    }>;
}
