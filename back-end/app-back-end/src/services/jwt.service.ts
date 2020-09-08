import {TokenService} from '@loopback/authentication';
import {bind, BindingScope, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {v4 as uuidv4} from 'uuid';
import {PasswordHasherService} from '.';
import {JwtServiceBindings, PasswordHasherBindings} from '../config/key';
import {BlacklistRepository} from '../repositories';
const JWT = require('jsonwebtoken');
const signAsync = promisify(JWT.sign);
const verifyAsync = promisify(JWT.verify);

@bind({scope: BindingScope.TRANSIENT})
export class JwtService implements TokenService {
    public static INVALID_TOKEN_MESSAGE: string = 'Invalid Token';
    public static EXPIRED_TOKEN_MESSAGE: string = 'Expired Token';
    constructor(
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        private passwordService: PasswordHasherService,
        @inject(JwtServiceBindings.SECRET_KEY) private secretKey: string,
        @inject(JwtServiceBindings.TOKEN_EXPIRES_IN)
        private expireValue: string,
        @repository(BlacklistRepository) private blacklist: BlacklistRepository,
    ) {}

    async verifyToken(token: string): Promise<UserProfile> {
        if (!token) {
            throw new HttpErrors.Unauthorized(JwtService.INVALID_TOKEN_MESSAGE);
        }

        let validProfile;
        try {
            validProfile = await verifyAsync(token, this.secretKey);
        } catch (error) {
            if (error.name == 'TokenExpiredError') {
                throw new HttpErrors.BadRequest(
                    JwtService.EXPIRED_TOKEN_MESSAGE,
                );
            }
        }

        if (!validProfile) {
            throw new HttpErrors.Unauthorized(JwtService.INVALID_TOKEN_MESSAGE);
        }
        const storeVal = this.passwordService.getStoreValue(validProfile);

        if (await this.blacklist.checkToken(storeVal)) {
            throw new HttpErrors.Unauthorized(JwtService.INVALID_TOKEN_MESSAGE);
        }
        let userProfile: UserProfile = Object.assign({
            [securityId]: validProfile.profile.id,
            ...validProfile,
        });

        return userProfile;
    }
    async generateToken(
        user: UserProfile,
        expire: Number = Number(this.expireValue),
    ): Promise<string> {
        if (!user) {
            throw new HttpErrors.Unauthorized('Invalid user');
        }
        let payload = Object.assign({}, user, {jti: uuidv4()});
        const token: string = signAsync(payload, this.secretKey, {
            expiresIn: expire,
        });
        return token;
    }

    async generateRefreshToken(user: UserProfile): Promise<string> {
        if (!user) {
            throw new HttpErrors.Unauthorized('Invalid user');
        }
        let payload = Object.assign({}, user, {jti: uuidv4()});
        const token: string = signAsync(payload, this.secretKey);
        return token;
    }
}
