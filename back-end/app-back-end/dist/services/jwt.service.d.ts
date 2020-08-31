import { TokenService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
export declare class JwtService implements TokenService {
    private secretKey;
    private expireValue;
    static INVALID_TOKEN_MESSAGE: string;
    static EXPIRED_TOKEN_MESSAGE: string;
    constructor(secretKey: string, expireValue: string);
    verifyToken(token: string): Promise<UserProfile>;
    generateToken(user: UserProfile, expire?: Number): Promise<string>;
    generateRefreshToken(user: UserProfile): Promise<string>;
}
