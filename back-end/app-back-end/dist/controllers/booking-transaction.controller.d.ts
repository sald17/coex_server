import { Count, Filter, Where } from '@loopback/repository';
import { Booking, Transaction } from '../models';
import { BookingRepository } from '../repositories';
export declare class BookingTransactionController {
    protected bookingRepository: BookingRepository;
    constructor(bookingRepository: BookingRepository);
    get(id: string, filter?: Filter<Transaction>): Promise<Transaction>;
    create(id: typeof Booking.prototype.id, transaction: Omit<Transaction, 'id'>): Promise<Transaction>;
    patch(id: string, transaction: Partial<Transaction>, where?: Where<Transaction>): Promise<Count>;
    delete(id: string, where?: Where<Transaction>): Promise<Count>;
}
