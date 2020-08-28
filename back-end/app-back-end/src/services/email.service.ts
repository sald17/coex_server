import {bind, /* inject, */ BindingScope} from '@loopback/core';
import nodemailer from 'nodemailer';
const MY_EMAIL = 'saldyy92@gmail.com';

@bind({scope: BindingScope.TRANSIENT})
export class EmailService {
    transporter: any;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MY_EMAIL,
                pass: 'qwaszx@1234',
            },
        });
    }

    async sendVerificationEmail(rcver: string, token: string) {
        try {
            const mailContent = {
                from: MY_EMAIL,
                to: rcver,
                subject: 'Verification Email.',
                html: `
                    <h1>This is a verification email.</h1>
                    <p>Click <a href="http://localhost:3000/api/user/verification/${token}">here</a> to verify your email.</p>
                `,
            };
            const result = await this.transporter.sendMail(mailContent);
            if (!result) {
                throw new Error('Email not valid. Try again.');
            }
            console.log('====');
            console.log(result);
            return result;
        } catch (err) {
            return {error: true, message: err.message};
        }
    }

    async sendEmail(rcver: string, content: string) {
        try {
            const mailContent = {
                from: MY_EMAIL,
                to: rcver,
                subject: 'Test email',
                text: content,
            };
            console.log('===========');

            const info = await this.transporter.sendMail(mailContent);
            console.log(info);
            return info;
        } catch (err) {
            console.log(err);
            return err.message;
        }
    }
}
