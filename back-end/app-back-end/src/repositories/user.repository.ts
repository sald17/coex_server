import {Getter, inject} from '@loopback/core';
import {
    DefaultCrudRepository,
    HasManyRepositoryFactory,
    HasOneRepositoryFactory,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {Booking, CoWorking, User, UserRelations} from '../models';
import {BookingRepository} from './booking.repository';
import {CoWorkingRepository} from './co-working.repository';

export class UserRepository extends DefaultCrudRepository<
    User,
    typeof User.prototype.id,
    UserRelations
> {
    public readonly coWorking: HasOneRepositoryFactory<
        CoWorking,
        typeof User.prototype.id
    >;

    public readonly bookings: HasManyRepositoryFactory<
        Booking,
        typeof User.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('CoWorkingRepository')
        protected coWorkingRepositoryGetter: Getter<CoWorkingRepository>,
        @repository.getter('BookingRepository')
        protected bookingRepositoryGetter: Getter<BookingRepository>,
    ) {
        super(User, dataSource);
        this.bookings = this.createHasManyRepositoryFactoryFor(
            'bookings',
            bookingRepositoryGetter,
        );
        this.registerInclusionResolver(
            'bookings',
            this.bookings.inclusionResolver,
        );
        this.coWorking = this.createHasOneRepositoryFactoryFor(
            'coWorking',
            coWorkingRepositoryGetter,
        );
        this.registerInclusionResolver(
            'coWorking',
            this.coWorking.inclusionResolver,
        );
    }
}
