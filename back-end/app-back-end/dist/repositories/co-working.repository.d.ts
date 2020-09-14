import { Getter } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { CoWorking, CoWorkingRelations, Room, User, Review } from '../models';
import { RoomRepository } from './room.repository';
import { UserRepository } from './user.repository';
import { ReviewRepository } from './review.repository';
export declare class CoWorkingRepository extends DefaultCrudRepository<CoWorking, typeof CoWorking.prototype.id, CoWorkingRelations> {
    protected roomRepositoryGetter: Getter<RoomRepository>;
    protected reviewRepositoryGetter: Getter<ReviewRepository>;
    readonly user: BelongsToAccessor<User, typeof CoWorking.prototype.id>;
    readonly rooms: HasManyRepositoryFactory<Room, typeof CoWorking.prototype.id>;
    readonly reviews: HasManyRepositoryFactory<Review, typeof CoWorking.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, userRepositoryGetter: Getter<UserRepository>, roomRepositoryGetter: Getter<RoomRepository>, reviewRepositoryGetter: Getter<ReviewRepository>);
}
