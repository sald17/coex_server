/// <reference types="express" />
import { AuthenticationStrategy } from '@loopback/authentication';
import { Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { BlacklistRepository } from '../../repositories';
import { JwtService } from '../../services/jwt.service';
export declare class JWTStrategy implements AuthenticationStrategy {
    private blacklist;
    private jwtService;
    name: string;
    constructor(blacklist: BlacklistRepository, jwtService: JwtService);
    authenticate(request: Request): Promise<UserProfile | undefined>;
    extractToken(request: Request): string;
}
