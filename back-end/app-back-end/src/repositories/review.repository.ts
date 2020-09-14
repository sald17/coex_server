import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {CoWorking, Review, ReviewRelations, User} from '../models';
import {CoWorkingRepository} from './co-working.repository';
import {UserRepository} from './user.repository';

export class ReviewRepository extends DefaultCrudRepository<
    Review,
    typeof Review.prototype.id,
    ReviewRelations
> {
    public readonly user: BelongsToAccessor<User, typeof Review.prototype.id>;

    public readonly coWorking: BelongsToAccessor<
        CoWorking,
        typeof Review.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('UserRepository')
        protected userRepositoryGetter: Getter<UserRepository>,
        @repository.getter('CoWorkingRepository')
        protected coWorkingRepositoryGetter: Getter<CoWorkingRepository>,
    ) {
        super(Review, dataSource);
        this.coWorking = this.createBelongsToAccessorFor(
            'coWorking',
            coWorkingRepositoryGetter,
        );
        this.registerInclusionResolver(
            'coWorking',
            this.coWorking.inclusionResolver,
        );
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter,
        );
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }

    async isUserReviewed(userId: string, cwId: string) {
        const review = await this.findOne({
            where: {
                userId,
                coWorkingId: cwId,
            },
        });
        return review ? true : false;
    }
}
