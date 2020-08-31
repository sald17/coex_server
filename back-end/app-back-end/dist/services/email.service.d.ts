export declare class EmailService {
    transporter: any;
    constructor();
    sendVerificationEmail(rcver: string, token: string): Promise<any>;
    sendOTPEmail(rcver: string, otp: string): Promise<any>;
    sendEmail(rcver: string, content: string): Promise<any>;
}
