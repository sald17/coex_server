import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {bind, inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {JwtServiceBindings} from '../../config/key';
import {JwtService} from '../../services/jwt.service';

@bind(asAuthStrategy)
export class JWTStrategy implements AuthenticationStrategy {
    name = 'jwt';
    INVALID_TOKEN_MESSAGE: string = 'Invalid Token';

    constructor(
        @inject(JwtServiceBindings.TOKEN_SERVICE) public jwtService: JwtService,
    ) {}

    async authenticate(request: Request): Promise<UserProfile | undefined> {
        let token = this.extractToken(request);
        let userProfile = await this.jwtService.verifyToken(token);
        return userProfile;
    }

    extractToken(request: Request): string {
        let authHeader = request.headers.authorization;
        if (!authHeader?.startsWith('Bearer ') || !authHeader) {
            throw new HttpErrors.NotAcceptable(this.INVALID_TOKEN_MESSAGE);
        }
        let parts = authHeader.split(' ');
        if (parts.length != 2) {
            throw new HttpErrors.NotAcceptable(this.INVALID_TOKEN_MESSAGE);
        }
        return parts[1];
    }
}
