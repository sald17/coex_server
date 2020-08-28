"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
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
        }
        catch (err) {
            return { error: true, message: err.message };
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