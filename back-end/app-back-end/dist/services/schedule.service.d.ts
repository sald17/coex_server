import { User } from '../models';
import { UserRepository } from '../repositories';
import { BookingRepository } from '../repositories/booking.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
export declare class ScheduleService {
    private userRepository;
    private bookingRepository;
    private transactionRepository;
    static agenda: any;
    constructor(userRepository: UserRepository, bookingRepository: BookingRepository, transactionRepository: TransactionRepository);
    static cancelSchedule(name: string): Promise<void>;
    static notifyCheckIn(bookingRef: string, startTime: Date, user: User, host: User, before?: number): Promise<void>;
    static notifyCheckOut(bookingRef: string, endTime: Date, user: User, host: User, before?: number): Promise<void>;
    static verifyCheckIn: (id: any, startTime: Date, bookingRef: string, bookingRepository: BookingRepository) => Promise<void>;
    static verifyCheckOut(id: any, endTime: Date, bookingRef: string, bookingRepository: BookingRepository): Promise<void>;
}
