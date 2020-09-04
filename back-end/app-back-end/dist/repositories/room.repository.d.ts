import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { Room, RoomRelations, Service } from '../models';
import { ServiceRepository } from './service.repository';
export declare class RoomRepository extends DefaultCrudRepository<Room, typeof Room.prototype.id, RoomRelations> {
    protected serviceRepositoryGetter: Getter<ServiceRepository>;
    readonly service: HasOneRepositoryFactory<Service, typeof Room.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, serviceRepositoryGetter: Getter<ServiceRepository>);
}
