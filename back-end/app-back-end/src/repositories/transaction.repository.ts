import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {Booking, Transaction, TransactionRelations} from '../models';
import {BookingRepository} from './booking.repository';

export class TransactionRepository extends DefaultCrudRepository<
    Transaction,
    typeof Transaction.prototype.id,
    TransactionRelations
> {
    public readonly booking: BelongsToAccessor<
        Booking,
        typeof Transaction.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('BookingRepository')
        protected bookingRepositoryGetter: Getter<BookingRepository>,
    ) {
        super(Transaction, dataSource);
        this.booking = this.createBelongsToAccessorFor(
            'booking',
            bookingRepositoryGetter,
        );
        this.registerInclusionResolver(
            'booking',
            this.booking.inclusionResolver,
        );
    }

    async getBookingReference() {
        let ref = Math.floor(Math.random() * 1000000) + '';
        while (
            (await this.findOne({where: {bookingRefernce: ref}})) === undefined
        ) {
            ref = Math.floor(Math.random() * 100000) + '';
        }
        return ref;
    }
}
