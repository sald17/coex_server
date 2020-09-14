import { Getter } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { CoWorking, Review, ReviewRelations, User } from '../models';
import { CoWorkingRepository } from './co-working.repository';
import { UserRepository } from './user.repository';
export declare class ReviewRepository extends DefaultCrudRepository<Review, typeof Review.prototype.id, ReviewRelations> {
    protected userRepositoryGetter: Getter<UserRepository>;
    protected coWorkingRepositoryGetter: Getter<CoWorkingRepository>;
    readonly user: BelongsToAccessor<User, typeof Review.prototype.id>;
    readonly coWorking: BelongsToAccessor<CoWorking, typeof Review.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, userRepositoryGetter: Getter<UserRepository>, coWorkingRepositoryGetter: Getter<CoWorkingRepository>);
    isUserReviewed(userId: string, cwId: string): Promise<boolean>;
}
