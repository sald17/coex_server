import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    HasManyRepositoryFactory,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {CoWorking, CoWorkingRelations, Room, User} from '../models';
import {RoomRepository} from './room.repository';
import {UserRepository} from './user.repository';

export class CoWorkingRepository extends DefaultCrudRepository<
    CoWorking,
    typeof CoWorking.prototype.id,
    CoWorkingRelations
> {
    public readonly user: BelongsToAccessor<
        User,
        typeof CoWorking.prototype.id
    >;

    public readonly rooms: HasManyRepositoryFactory<
        Room,
        typeof CoWorking.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('UserRepository')
        userRepositoryGetter: Getter<UserRepository>,
        @repository.getter('RoomRepository')
        protected roomRepositoryGetter: Getter<RoomRepository>,
    ) {
        super(CoWorking, dataSource);
        this.rooms = this.createHasManyRepositoryFactoryFor(
            'rooms',
            roomRepositoryGetter,
        );
        this.registerInclusionResolver('rooms', this.rooms.inclusionResolver);
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter,
        );
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
}
