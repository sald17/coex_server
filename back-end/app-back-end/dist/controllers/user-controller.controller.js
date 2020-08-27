"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllerController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const key_1 = require("../config/key");
const repositories_1 = require("../repositories");
const email_service_1 = require("../services/email.service");
const file_upload_1 = require("../services/file-upload");
const jwt_service_1 = require("../services/jwt.service");
const password_hasher_service_1 = require("../services/password-hasher.service");
// import {inject} from '@loopback/core';
let UserControllerController = class UserControllerController {
    constructor(userRepository, thirdPartyRepository, passwordHasher, jwtService, emailService, uploadFileService) {
        this.userRepository = userRepository;
        this.thirdPartyRepository = thirdPartyRepository;
        this.passwordHasher = passwordHasher;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.uploadFileService = uploadFileService;
    }
    async getUser(userProfile) {
        return await this.userRepository.find({
            include: [
                {
                    relation: 'identities',
                },
            ],
        });
    }
    async fileUpload(request, response) {
        return new Promise((resolve, reject) => {
            this.uploadFileService(request, response, (err) => {
                if (err)
                    reject(err);
                else {
                    resolve(file_upload_1.FileUploadProvider.getFilesAndFields(request));
                }
            });
        });
    }
    async signup(user) {
        console.log(user);
        const isExisted = await this.userRepository.findOne({
            where: {
                email: user.email,
            },
        });
        if (isExisted) {
            throw new rest_1.HttpErrors.BadRequest('Email is already registered.');
            return;
        }
        user.password = await this.passwordHasher.hashPassword(user.password);
        const newUser = await this.userRepository.create(user);
        if (!newUser) {
            throw new rest_1.HttpErrors.BadRequest('Error in registering. Try again');
            return;
        }
        const userProfile = Object.assign({
            profile: {
                [security_1.securityId]: newUser.id,
                email: newUser.email,
                username: newUser.username,
                id: newUser.id,
            },
        });
        let verifiedToken = await this.jwtService.generateToken(userProfile, 1000 * 60 * 10);
        await this.emailService.sendVerificationEmail(newUser.email, verifiedToken);
        return { messgage: 'Created successfully' };
    }
    async login(user, userProfile, request, response) {
        delete userProfile.profile.password;
        let token = await this.jwtService.generateToken(userProfile);
        return { token };
    }
    async verifyEmail(verifyToken) {
        const verified = await this.jwtService.verifyToken(verifyToken);
        if (!verified) {
            throw new rest_1.HttpErrors.BadRequest();
            return;
        }
        this.userRepository.updateById(verified.profile.id, {
            emailVerified: true,
        });
        return 'Email is verified';
    }
};
tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    rest_1.get('/users'),
    tslib_1.__param(0, core_1.inject(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "getUser", null);
tslib_1.__decorate([
    rest_1.post('/files', {
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                        },
                    },
                },
                description: 'Files and fields',
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody.file()),
    tslib_1.__param(1, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "fileUpload", null);
tslib_1.__decorate([
    rest_1.post('/user/sign-up'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "signup", null);
tslib_1.__decorate([
    authentication_1.authenticate('local'),
    rest_1.post('/user/log-in'),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__param(1, core_1.inject(security_1.SecurityBindings.USER)),
    tslib_1.__param(2, core_1.inject(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__param(3, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "login", null);
tslib_1.__decorate([
    rest_1.get('/user/verification/{verifyToken}'),
    tslib_1.__param(0, rest_1.param.path.string('verifyToken')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserControllerController.prototype, "verifyEmail", null);
UserControllerController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.ThirdPartyIdentityRepository)),
    tslib_1.__param(2, core_1.inject(key_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__param(3, core_1.inject(key_1.JwtServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(4, core_1.inject(key_1.EmailServiceBindings.EMAIL_SERVICE)),
    tslib_1.__param(5, core_1.inject(key_1.FILE_UPLOAD_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        repositories_1.ThirdPartyIdentityRepository,
        password_hasher_service_1.PasswordHasherService,
        jwt_service_1.JwtService,
        email_service_1.EmailService, Function])
], UserControllerController);
exports.UserControllerController = UserControllerController;
//# sourceMappingURL=user-controller.controller.js.map