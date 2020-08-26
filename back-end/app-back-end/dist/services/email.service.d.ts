export declare class EmailService {
    transporter: any;
    constructor();
    sendVerificationEmail(rcver: string, token: string): Promise<void>;
}
