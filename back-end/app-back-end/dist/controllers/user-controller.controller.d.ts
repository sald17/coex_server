import { UserProfile } from '@loopback/security';
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
    constructor(userRepository: UserRepository, thirdPartyRepository: ThirdPartyIdentityRepository, blacklist: BlacklistRepository, user: UserProfile, passwordHasher: PasswordHasherService, jwtService: JwtService, emailService: EmailService);
    signup(user: any): Promise<{
        message: string;
    }>;
    login(userProfile: UserProfile): Promise<{
        token: string;
        refreshToken: any;
    }>;
    verifyEmail(verifyToken: string): Promise<string>;
    logout(): Promise<{
        message: string;
    }>;
    refreshToken(body: any): Promise<{
        token: string;
        refreshToken: string;
    }>;
    changePassword(userCredential: any): Promise<{
        message: string;
    }>;
    forgotPassword(body: any): Promise<{
        message: string;
        otp: string;
    }>;
    resetPassword(body: any): Promise<{
        message: string;
    }>;
}
