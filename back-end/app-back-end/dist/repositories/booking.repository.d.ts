import { Getter } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, HasOneRepositoryFactory } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { Booking, BookingRelations, Room, Transaction, User } from '../models';
import { RoomRepository } from './room.repository';
import { TransactionRepository } from './transaction.repository';
import { UserRepository } from './user.repository';
export declare class BookingRepository extends DefaultCrudRepository<Booking, typeof Booking.prototype.id, BookingRelations> {
    protected userRepositoryGetter: Getter<UserRepository>;
    protected roomRepositoryGetter: Getter<RoomRepository>;
    protected transactionRepositoryGetter: Getter<TransactionRepository>;
    readonly user: BelongsToAccessor<User, typeof Booking.prototype.id>;
    readonly room: BelongsToAccessor<Room, typeof Booking.prototype.id>;
    readonly transaction: HasOneRepositoryFactory<Transaction, typeof Booking.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, userRepositoryGetter: Getter<UserRepository>, roomRepositoryGetter: Getter<RoomRepository>, transactionRepositoryGetter: Getter<TransactionRepository>);
    /**
     * Check if sent booking is valid and return a standard model to add to db
     * @param userId
     * @param bookingInfo
     * @param userRepository
     * @param roomRepository
     */
    validateBooking(bookingInfo: any, room: Room): Promise<any>;
    /**
     * Find booking by date
     */
    findBookingByDate(date: string, { user, room }: any): Promise<(Booking & BookingRelations)[]>;
    /**
     * Get price of booking
     */
    getBookingPrice(bookingInfo: any, room: Room): number;
    checkUserRentCw(userId: string, cwId: string): Promise<boolean>;
}
