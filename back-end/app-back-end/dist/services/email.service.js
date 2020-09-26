"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const constants_1 = require("../config/constants");
const MY_EMAIL = 'saldyy92@gmail.com';
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: MY_EMAIL,
                pass: 'qwaszx@1234',
            },
        });
    }
    async sendVerificationEmail(rcver, token) {
        try {
            const mailContent = {
                from: MY_EMAIL,
                to: rcver,
                subject: 'Verification Email.',
                html: `
                    <h1>Xác thực email.</h1>
                    <p>Click vào <a href="${constants_1.BASE_URL}/api/user/verification/${token}">đây</a> để  xác thực email của bạn.</p>
                `,
            };
            const result = await this.transporter.sendMail(mailContent);
            if (!result) {
                throw new Error('Email not valid. Try again.');
            }
            return result;
        }
        catch (err) {
            return { error: true, message: err.message };
        }
    }
    async sendOTPEmail(rcver, otp) {
        try {
            const mailContent = {
                from: MY_EMAIL,
                to: rcver,
                subject: 'Reset mật khẩu',
                text: `Mã OTP để reset mật khẩu của bạn là ${otp}. Mã OTP này có hiệu lực trong 10 phút.`,
            };
            const info = await this.transporter.sendMail(mailContent);
            return info;
        }
        catch (err) {
            console.log(err);
            return err.message;
        }
    }
    async sendEmail(rcver, content) {
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
        }
        catch (err) {
            console.log(err);
            return err.message;
        }
    }
};
EmailService = tslib_1.__decorate([
    core_1.bind({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map