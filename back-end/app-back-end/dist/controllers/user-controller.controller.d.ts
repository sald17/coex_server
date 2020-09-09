import { UserProfile } from '@loopback/security';
import { BlacklistRepository, UserRepository } from '../repositories';
import { EmailService } from '../services/email.service';
import { JwtService } from '../services/jwt.service';
import { PasswordHasherService } from '../services/password-hasher.service';
export declare class UserControllerController {
    userRepository: UserRepository;
    blacklist: BlacklistRepository;
    private user;
    passwordHasher: PasswordHasherService;
    jwtService: JwtService;
    emailService: EmailService;
    constructor(userRepository: UserRepository, blacklist: BlacklistRepository, user: UserProfile, passwordHasher: PasswordHasherService, jwtService: JwtService, emailService: EmailService);
    signup(user: any, role: string): Promise<{
        message: string;
    }>;
    /**
     *  User log in
     *
     *  return an access token
     *
     */
    login(role: string, credential: any): Promise<{
        token: string;
    }>;
    verifyEmail(verifyToken: string): Promise<string>;
    /**
     * Log out
     */
    logout(): Promise<{
        message: string;
    }>;
    /**
     * Thay doi mat khau
     *
     */
    changePassword(userCredential: any): Promise<{
        message: string;
    }>;
    /**
     * Quen mat khau va gui email cho user
     */
    forgotPassword(body: any): Promise<{
        message: string;
    }>;
    /**
     *  Reset mat khau sau khi bam nut quen mat khau
     *
     */
    resetPassword(body: any): Promise<{
        message: string;
    }>;
    getMe(): Promise<import("../models").User & import("../models").UserRelations>;
}
