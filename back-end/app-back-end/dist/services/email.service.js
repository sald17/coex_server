"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const MY_EMAIL = 'saldyy92@gmail.com';
let EmailService = class EmailService {
    constructor( /* Add @inject to inject parameters */) {
        this.transporter = nodemailer_1.default.createTransport({
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
    async sendVerificationEmail(rcver, token) {
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
    async sendEmail(rcver, content) {
        const mailContent = {
            from: MY_EMAIL,
            to: rcver,
            subject: 'Test email',
            text: content,
        };
        let result = this.transporter.sendMail(mailContent);
        console.log('===========');
        console.log(result);
    }
};
EmailService = tslib_1.__decorate([
    core_1.bind({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map