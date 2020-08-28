import { RequestWithSession, Response } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { RequestHandler } from 'express';
import { BlacklistRepository, ThirdPartyIdentityRepository, UserRepository } from '../repositories';
import { EmailService } from '../services/email.service';
import { JwtService } from '../services/jwt.service';
import { PasswordHasherService } from '../services/password-hasher.service';
export declare class UserControllerController {
    userRepository: UserRepository;
    thirdPartyRepository: ThirdPartyIdentityRepository;
    blacklist: BlacklistRepository;
    private user;
    passwordHasher: PasswordHasherService;
    jwtService: JwtService;
    emailService: EmailService;
    uploadFileService: RequestHandler;
    constructor(userRepository: UserRepository, thirdPartyRepository: ThirdPartyIdentityRepository, blacklist: BlacklistRepository, user: UserProfile, passwordHasher: PasswordHasherService, jwtService: JwtService, emailService: EmailService, uploadFileService: RequestHandler);
    signup(user: any): Promise<{
        message: string;
    }>;
    login(user: any, userProfile: UserProfile, request: RequestWithSession, response: Response): Promise<{
        token: string;
    }>;
    verifyEmail(verifyToken: string): Promise<string>;
    logout(): Promise<{
        message: string;
    }>;
}
