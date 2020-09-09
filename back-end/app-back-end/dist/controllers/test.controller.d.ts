import { BookingRepository } from '../repositories';
export declare class TestController {
    private bookingRepository;
    constructor(bookingRepository: BookingRepository);
    test(): Promise<void>;
}
