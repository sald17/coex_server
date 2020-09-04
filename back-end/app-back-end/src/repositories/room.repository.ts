import {Getter, inject} from '@loopback/core';
import {
    DefaultCrudRepository,
    HasOneRepositoryFactory,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {Room, RoomRelations, Service} from '../models';
import {ServiceRepository} from './service.repository';

export class RoomRepository extends DefaultCrudRepository<
    Room,
    typeof Room.prototype.id,
    RoomRelations
> {
    public readonly service: HasOneRepositoryFactory<
        Service,
        typeof Room.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('ServiceRepository')
        protected serviceRepositoryGetter: Getter<ServiceRepository>,
    ) {
        super(Room, dataSource);
        this.service = this.createHasOneRepositoryFactoryFor(
            'service',
            serviceRepositoryGetter,
        );
        this.registerInclusionResolver(
            'service',
            this.service.inclusionResolver,
        );
    }
}
