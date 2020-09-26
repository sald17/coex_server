/// <reference types="express" />
import { Request, Response } from '@loopback/rest';
import { BookingRepository, UserRepository } from '../repositories';
export declare class TestController {
    private bookingRepository;
    private userRepository;
    constructor(bookingRepository: BookingRepository, userRepository: UserRepository);
    test(): Promise<string>;
    testNoti(): Promise<void>;
    create(request: Request, response: Response): Promise<any>;
}
