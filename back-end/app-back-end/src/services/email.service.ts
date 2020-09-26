import {bind, /* inject, */ BindingScope} from '@loopback/core';
import nodemailer from 'nodemailer';
import {BASE_URL} from '../config/constants';
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
                    <h1>Xác thực email.</h1>
                    <p>Click vào <a href="${BASE_URL}/api/user/verification/${token}">đây</a> để  xác thực email của bạn.</p>
                `,
            };
            const result = await this.transporter.sendMail(mailContent);
            if (!result) {
                throw new Error('Email not valid. Try again.');
            }
            return result;
        } catch (err) {
            return {error: true, message: err.message};
        }
    }

    async sendOTPEmail(rcver: string, otp: string) {
        try {
            const mailContent = {
                from: MY_EMAIL,
                to: rcver,
                subject: 'Reset mật khẩu',
                text: `Mã OTP để reset mật khẩu của bạn là ${otp}. Mã OTP này có hiệu lực trong 10 phút.`,
            };
            const info = await this.transporter.sendMail(mailContent);
            return info;
        } catch (err) {
            console.log(err);
            return err.message;
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
