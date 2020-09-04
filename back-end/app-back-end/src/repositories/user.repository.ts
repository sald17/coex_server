import {Getter, inject} from '@loopback/core';
import {
    DefaultCrudRepository,
    HasOneRepositoryFactory,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {CoWorking, User, UserRelations} from '../models';
import {CoWorkingRepository} from './co-working.repository';

export class UserRepository extends DefaultCrudRepository<
    User,
    typeof User.prototype.id,
    UserRelations
> {
    public readonly coWorking: HasOneRepositoryFactory<
        CoWorking,
        typeof User.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('CoWorkingRepository')
        protected coWorkingRepositoryGetter: Getter<CoWorkingRepository>,
    ) {
        super(User, dataSource);
        this.coWorking = this.createHasOneRepositoryFactoryFor(
            'coWorking',
            coWorkingRepositoryGetter,
        );
        this.registerInclusionResolver(
            'coWorking',
            this.coWorking.inclusionResolver,
        );
    }
}
