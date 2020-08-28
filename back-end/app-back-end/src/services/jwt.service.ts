import {TokenService} from '@loopback/authentication';
import {bind, BindingScope, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {v4 as uuidv4} from 'uuid';
// import JWT from 'jsonwebtoken';
import {JwtServiceBindings} from '../config/key';
const JWT = require('jsonwebtoken');
const signAsync = promisify(JWT.sign);
const verifyAsync = promisify(JWT.verify);
@bind({scope: BindingScope.TRANSIENT})
export class JwtService implements TokenService {
    constructor(
        @inject(JwtServiceBindings.SECRET_KEY) private secretKey: string,
        @inject(JwtServiceBindings.TOKEN_EXPIRES_IN)
        private expireValue: string,
    ) {}

    async verifyToken(token: string): Promise<UserProfile> {
        const INVALID_TOKEN_MESSAGE = 'Invalid Token';
        if (!token) {
            throw new HttpErrors.Unauthorized(INVALID_TOKEN_MESSAGE);
        }

        let validProfile = await verifyAsync(token, this.secretKey);
        if (!validProfile) {
            throw new HttpErrors.Unauthorized(INVALID_TOKEN_MESSAGE);
        }
        // console.log(isValid);
        let userProfile: UserProfile = Object.assign({
            [securityId]: validProfile.id,
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
        console.log(payload);
        const token: string = signAsync(payload, this.secretKey, {
            expiresIn: expire,
        });
        return token;
    }
}
