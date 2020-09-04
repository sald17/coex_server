import { DefaultCrudRepository, BelongsToAccessor } from '@loopback/repository';
import { Service, ServiceRelations, Room } from '../models';
import { MongoConnectorDataSource } from '../datasources';
import { Getter } from '@loopback/core';
import { RoomRepository } from './room.repository';
export declare class ServiceRepository extends DefaultCrudRepository<Service, typeof Service.prototype.id, ServiceRelations> {
    protected roomRepositoryGetter: Getter<RoomRepository>;
    readonly room: BelongsToAccessor<Room, typeof Service.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, roomRepositoryGetter: Getter<RoomRepository>);
}
