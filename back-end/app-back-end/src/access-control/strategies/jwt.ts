import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {bind, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {JwtServiceBindings} from '../../config/key';
import {BlacklistRepository} from '../../repositories';
import {JwtService} from '../../services/jwt.service';

@bind(asAuthStrategy)
export class JWTStrategy implements AuthenticationStrategy {
    name = 'jwt';

    constructor(
        @repository(BlacklistRepository) private blacklist: BlacklistRepository,
        @inject(JwtServiceBindings.TOKEN_SERVICE)
        private jwtService: JwtService,
    ) {}

    async authenticate(request: Request): Promise<UserProfile | undefined> {
        let token = this.extractToken(request);
        let userProfile = await this.jwtService.verifyToken(token);
        // check token in blacklist
        const isValid = await this.blacklist.checkToken(
            `${userProfile.jti}:${userProfile.exp}`,
        );
        if (isValid) {
            throw new HttpErrors.NotAcceptable(
                JwtService.INVALID_TOKEN_MESSAGE,
            );
        }
        if (request.url.includes('logout')) {
            userProfile.profile.token = token;
        }
        return userProfile;
    }

    extractToken(request: Request): string {
        let authHeader = request.headers.authorization;
        if (!authHeader?.startsWith('Bearer ') || !authHeader) {
            throw new HttpErrors.NotAcceptable(
                JwtService.INVALID_TOKEN_MESSAGE,
            );
        }
        let parts = authHeader.split(' ');
        if (parts.length != 2) {
            throw new HttpErrors.NotAcceptable(
                JwtService.INVALID_TOKEN_MESSAGE,
            );
        }
        return parts[1];
    }
}
