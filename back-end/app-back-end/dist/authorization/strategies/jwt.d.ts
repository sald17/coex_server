/// <reference types="express" />
import { AuthenticationStrategy } from '@loopback/authentication';
import { Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { JwtService } from '../../services/jwt.service';
export declare class JWTStrategy implements AuthenticationStrategy {
    jwtService: JwtService;
    name: string;
    INVALID_TOKEN_MESSAGE: string;
    constructor(jwtService: JwtService);
    authenticate(request: Request): Promise<UserProfile | undefined>;
    extractToken(request: Request): string;
}
