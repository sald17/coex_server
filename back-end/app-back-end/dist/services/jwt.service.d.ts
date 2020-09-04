import { TokenService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { PasswordHasherService } from '.';
import { BlacklistRepository } from '../repositories';
export declare class JwtService implements TokenService {
    private passwordService;
    private secretKey;
    private expireValue;
    private blacklist;
    static INVALID_TOKEN_MESSAGE: string;
    static EXPIRED_TOKEN_MESSAGE: string;
    constructor(passwordService: PasswordHasherService, secretKey: string, expireValue: string, blacklist: BlacklistRepository);
    verifyToken(token: string): Promise<UserProfile>;
    generateToken(user: UserProfile, expire?: Number): Promise<string>;
    generateRefreshToken(user: UserProfile): Promise<string>;
}
