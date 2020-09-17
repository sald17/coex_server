import { BookingRepository, UserRepository } from '../repositories';
export declare class TestController {
    private bookingRepository;
    private userRepository;
    constructor(bookingRepository: BookingRepository, userRepository: UserRepository);
    test(): Promise<string>;
    testNoti(): Promise<void>;
}
