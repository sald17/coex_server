import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { Booking, CoWorking, User, UserRelations, Card } from '../models';
import { BookingRepository } from './booking.repository';
import { CoWorkingRepository } from './co-working.repository';
import { CardRepository } from './card.repository';
export declare class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id, UserRelations> {
    protected coWorkingRepositoryGetter: Getter<CoWorkingRepository>;
    protected bookingRepositoryGetter: Getter<BookingRepository>;
    protected cardRepositoryGetter: Getter<CardRepository>;
    readonly coWorking: HasOneRepositoryFactory<CoWorking, typeof User.prototype.id>;
    readonly bookings: HasManyRepositoryFactory<Booking, typeof User.prototype.id>;
    readonly cards: HasManyRepositoryFactory<Card, typeof User.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, coWorkingRepositoryGetter: Getter<CoWorkingRepository>, bookingRepositoryGetter: Getter<BookingRepository>, cardRepositoryGetter: Getter<CardRepository>);
}
