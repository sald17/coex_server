import { Booking, Room, Transaction, User } from '../models';
import { BookingRepository } from '../repositories';
export declare class NotificationService {
    static notifyAfterCreate(newTransaction: Transaction, newBooking: Booking, room: any, user: User, host: User, bookingRepository: BookingRepository): Promise<void>;
    static notifyAfterUpdate(newTransaction: Transaction, newBooking: Booking, room: any, user: User, host: User, bookingRepository: BookingRepository): Promise<void>;
    static notifyAfterCancel(newTransaction: Transaction, host: User): Promise<void>;
    static notifyAfterCheckout(user: User, host: User, point: number, bookingRef: string): Promise<void>;
    static notifyAfterCheckin(client: User, host: User, room: Room, bookingRef: string): Promise<void>;
}
