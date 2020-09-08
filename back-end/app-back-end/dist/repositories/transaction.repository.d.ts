import { Getter } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { Booking, Transaction, TransactionRelations } from '../models';
import { BookingRepository } from './booking.repository';
export declare class TransactionRepository extends DefaultCrudRepository<Transaction, typeof Transaction.prototype.id, TransactionRelations> {
    protected bookingRepositoryGetter: Getter<BookingRepository>;
    readonly booking: BelongsToAccessor<Booking, typeof Transaction.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, bookingRepositoryGetter: Getter<BookingRepository>);
    getBookingReference(): Promise<string>;
}
