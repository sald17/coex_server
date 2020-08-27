import { EmailService } from '../services/email.service';
export declare class TestController {
    emailService: EmailService;
    constructor(emailService: EmailService);
    sendEmail(): Promise<void>;
}
