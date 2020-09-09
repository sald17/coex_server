import { FilterExcludingWhere } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
import { Booking } from '../models';
import { BookingRepository, ExchangePointRepository, RoomRepository, TransactionRepository, UserRepository } from '../repositories';
export declare class BookingController {
    bookingRepository: BookingRepository;
    userRepository: UserRepository;
    roomRepository: RoomRepository;
    transactionRepository: TransactionRepository;
    pointRepository: ExchangePointRepository;
    user: UserProfile;
    constructor(bookingRepository: BookingRepository, userRepository: UserRepository, roomRepository: RoomRepository, transactionRepository: TransactionRepository, pointRepository: ExchangePointRepository, user: UserProfile);
    getPrice(bookingInfo: any): Promise<{
        price: number;
    }>;
    create(bookingInfo: any): Promise<Booking>;
    getHistory(): Promise<(Booking & import("../models").BookingRelations)[]>;
    find(date: string): Promise<Booking[]>;
    findById(id: string, filter?: FilterExcludingWhere<Booking>): Promise<Booking>;
    updateById(id: string, updatedBooking: any): Promise<void>;
    cancelBooking(id: string): Promise<void>;
    checkIn(id: string): Promise<void>;
    checkOut(id: string): Promise<void>;
}