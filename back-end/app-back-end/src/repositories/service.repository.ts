import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Service, ServiceRelations, Room} from '../models';
import {MongoConnectorDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RoomRepository} from './room.repository';

export class ServiceRepository extends DefaultCrudRepository<
  Service,
  typeof Service.prototype.id,
  ServiceRelations
> {

  public readonly room: BelongsToAccessor<Room, typeof Service.prototype.id>;

  constructor(
    @inject('datasources.MongoConnector') dataSource: MongoConnectorDataSource, @repository.getter('RoomRepository') protected roomRepositoryGetter: Getter<RoomRepository>,
  ) {
    super(Service, dataSource);
    this.room = this.createBelongsToAccessorFor('room', roomRepositoryGetter,);
    this.registerInclusionResolver('room', this.room.inclusionResolver);
  }
}
