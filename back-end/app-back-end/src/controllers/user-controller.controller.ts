// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
    get,
    post,
    requestBody,
    RequestWithSession,
    Response,
    RestBindings,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {JwtServiceBindings, PasswordHasherBindings} from '../config/key';
import {ThirdPartyIdentityRepository, UserRepository} from '../repositories';
import {JwtService} from '../services/jwt.service';
import {PasswordHasherService} from '../services/password-hasher.service';

// import {inject} from '@loopback/core';

export class UserControllerController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(ThirdPartyIdentityRepository)
        public thirdPartyRepository: ThirdPartyIdentityRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasherService,
        @inject(JwtServiceBindings.TOKEN_SERVICE)
        public jwtService: JwtService,
    ) {}

    @authenticate('jwt')
    @get('/users')
    async getUser(@inject(SecurityBindings.USER) userProfile: UserProfile) {
        console.log('AHIHIHIHI');
        console.log(userProfile);
        return await this.userRepository.find({
            include: [
                {
                    relation: 'identities',
                },
            ],
        });
    }

    @get('/third-party')
    async getThirdParty() {
        return await this.thirdPartyRepository.find({
            include: [
                {
                    relation: 'user',
                },
            ],
        });
    }

    @post('/user/sign-up')
    async signup(@requestBody() user: any) {
        console.log(user);
        let res = await this.passwordHasher.hashPassword(user.fullname);
        return {res};
    }

    @authenticate('local')
    @post('/user/log-in')
    async login(
        @requestBody() user: any,
        @inject(SecurityBindings.USER) userProfile: UserProfile,
        @inject(RestBindings.Http.REQUEST) request: RequestWithSession,
        @inject(RestBindings.Http.RESPONSE) response: Response,
    ) {
        delete userProfile.profile.password;
        let token = await this.jwtService.generateToken(userProfile);

        return {token};
    }
}
