/// <reference types="express" />
import { RequestWithSession, Response } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { ThirdPartyIdentityRepository, UserRepository } from '../repositories';
import { JwtService } from '../services/jwt.service';
import { PasswordHasherService } from '../services/password-hasher.service';
export declare class UserControllerController {
    userRepository: UserRepository;
    thirdPartyRepository: ThirdPartyIdentityRepository;
    passwordHasher: PasswordHasherService;
    jwtService: JwtService;
    constructor(userRepository: UserRepository, thirdPartyRepository: ThirdPartyIdentityRepository, passwordHasher: PasswordHasherService, jwtService: JwtService);
    getUser(userProfile: UserProfile): Promise<(import("../models").User & import("../models").UserRelations)[]>;
    getThirdParty(): Promise<(import("../models").ThirdPartyIdentity & import("../models").ThirdPartyIdentityRelations)[]>;
    signup(user: any): Promise<{
        res: string;
    }>;
    login(user: any, userProfile: UserProfile, request: RequestWithSession, response: Response): Promise<{
        token: string;
    }>;
}
