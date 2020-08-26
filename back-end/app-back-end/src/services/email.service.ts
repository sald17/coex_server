import {bind, /* inject, */ BindingScope} from '@loopback/core';
import nodemailer from 'nodemailer';

const MY_EMAIL = 'saldyy92@gmail.com';

@bind({scope: BindingScope.TRANSIENT})
export class EmailService {
    transporter: any;
    constructor(/* Add @inject to inject parameters */) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MY_EMAIL,
                pass: 'qwaszx@1234',
            },
        });
    }

    /*
     * Add service methods here
     */

    async sendVerificationEmail(rcver: string, token: string) {
        const mailContent = {
            from: MY_EMAIL,
            to: rcver,
            subject: 'Verification Email.',
            html: `
                <h1>This is a verification email.</h1>
                <p>Click <a href="http://localhost:3000/api/user/verification/${token}">here</a> to verify your email.</p>
            `,
        };
        this.transporter.sendMail(mailContent);
    }
}
