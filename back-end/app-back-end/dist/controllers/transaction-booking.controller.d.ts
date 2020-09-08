import { Booking, Transaction } from '../models';
import { TransactionRepository } from '../repositories';
export declare class TransactionBookingController {
    transactionRepository: TransactionRepository;
    constructor(transactionRepository: TransactionRepository);
    getBooking(id: typeof Transaction.prototype.id): Promise<Booking>;
}
