export declare class EmailService {
    transporter: any;
    constructor();
    sendVerificationEmail(rcver: string, token: string): Promise<void>;
    sendEmail(rcver: string, content: string): Promise<void>;
}
