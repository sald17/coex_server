import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    HasManyRepositoryFactory,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {CoWorking, CoWorkingRelations, Room, User, Review} from '../models';
import {RoomRepository} from './room.repository';
import {UserRepository} from './user.repository';
import {ReviewRepository} from './review.repository';

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

  public readonly reviews: HasManyRepositoryFactory<Review, typeof CoWorking.prototype.id>;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('UserRepository')
        userRepositoryGetter: Getter<UserRepository>,
        @repository.getter('RoomRepository')
        protected roomRepositoryGetter: Getter<RoomRepository>, @repository.getter('ReviewRepository') protected reviewRepositoryGetter: Getter<ReviewRepository>,
    ) {
        super(CoWorking, dataSource);
      this.reviews = this.createHasManyRepositoryFactoryFor('reviews', reviewRepositoryGetter,);
      this.registerInclusionResolver('reviews', this.reviews.inclusionResolver);
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
