import { Request, RequestWithSession, Response } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { RequestHandler } from 'express';
import { ThirdPartyIdentityRepository, UserRepository } from '../repositories';
import { EmailService } from '../services/email.service';
import { JwtService } from '../services/jwt.service';
import { PasswordHasherService } from '../services/password-hasher.service';
export declare class UserControllerController {
    userRepository: UserRepository;
    thirdPartyRepository: ThirdPartyIdentityRepository;
    passwordHasher: PasswordHasherService;
    jwtService: JwtService;
    emailService: EmailService;
    uploadFileService: RequestHandler;
    constructor(userRepository: UserRepository, thirdPartyRepository: ThirdPartyIdentityRepository, passwordHasher: PasswordHasherService, jwtService: JwtService, emailService: EmailService, uploadFileService: RequestHandler);
    getUser(userProfile: UserProfile): Promise<(import("../models").User & import("../models").UserRelations)[]>;
    fileUpload(request: Request, response: Response): Promise<object>;
    signup(user: any): Promise<{
        messgage: string;
    } | undefined>;
    login(user: any, userProfile: UserProfile, request: RequestWithSession, response: Response): Promise<{
        token: string;
    }>;
    verifyEmail(verifyToken: string): Promise<"Email is verified" | undefined>;
}
