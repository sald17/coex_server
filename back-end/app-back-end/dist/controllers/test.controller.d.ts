/// <reference types="express" />
import { Request, Response } from '@loopback/rest';
import { BookingRepository, UserRepository } from '../repositories';
export declare class TestController {
    private bookingRepository;
    private userRepository;
    constructor(bookingRepository: BookingRepository, userRepository: UserRepository);
    test(): Promise<string>;
    check(userId: string, cwId: string): Promise<boolean>;
    testNoti(): Promise<import("../models").User & import("../models").UserRelations>;
    create(request: Request, response: Response): Promise<any>;
}
