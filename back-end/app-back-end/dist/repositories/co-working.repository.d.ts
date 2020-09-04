import { Getter } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { CoWorking, CoWorkingRelations, Room, User } from '../models';
import { RoomRepository } from './room.repository';
import { UserRepository } from './user.repository';
export declare class CoWorkingRepository extends DefaultCrudRepository<CoWorking, typeof CoWorking.prototype.id, CoWorkingRelations> {
    protected roomRepositoryGetter: Getter<RoomRepository>;
    readonly user: BelongsToAccessor<User, typeof CoWorking.prototype.id>;
    readonly rooms: HasManyRepositoryFactory<Room, typeof CoWorking.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, userRepositoryGetter: Getter<UserRepository>, roomRepositoryGetter: Getter<RoomRepository>);
}
