import {Getter, inject} from '@loopback/core';
import {
    DefaultCrudRepository,
    HasManyRepositoryFactory,
    HasOneRepositoryFactory,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {Booking, Card, CoWorking, Review, User, UserRelations} from '../models';
import {BookingRepository} from './booking.repository';
import {CardRepository} from './card.repository';
import {CoWorkingRepository} from './co-working.repository';
import {ReviewRepository} from './review.repository';

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

    public readonly cards: HasManyRepositoryFactory<
        Card,
        typeof User.prototype.id
    >;

    public readonly reviews: HasManyRepositoryFactory<
        Review,
        typeof User.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('CoWorkingRepository')
        protected coWorkingRepositoryGetter: Getter<CoWorkingRepository>,
        @repository.getter('BookingRepository')
        protected bookingRepositoryGetter: Getter<BookingRepository>,
        @repository.getter('CardRepository')
        protected cardRepositoryGetter: Getter<CardRepository>,
        @repository.getter('ReviewRepository')
        protected reviewRepositoryGetter: Getter<ReviewRepository>,
    ) {
        super(User, dataSource);
        this.reviews = this.createHasManyRepositoryFactoryFor(
            'reviews',
            reviewRepositoryGetter,
        );
        this.registerInclusionResolver(
            'reviews',
            this.reviews.inclusionResolver,
        );
        this.cards = this.createHasManyRepositoryFactoryFor(
            'cards',
            cardRepositoryGetter,
        );
        this.registerInclusionResolver('cards', this.cards.inclusionResolver);
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
