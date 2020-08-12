import {Getter, inject} from '@loopback/core';
import {
    DefaultCrudRepository,
    HasManyRepositoryFactory,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {ThirdPartyIdentity, User, UserRelations} from '../models';
import {ThirdPartyIdentityRepository} from './third-party-identity.repository';

export class UserRepository extends DefaultCrudRepository<
    User,
    typeof User.prototype.id,
    UserRelations
> {
    public readonly identities: HasManyRepositoryFactory<
        ThirdPartyIdentity,
        typeof ThirdPartyIdentity.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('ThirdPartyIdentityRepository')
        protected thirdPartyRepositoryGetter: Getter<
            ThirdPartyIdentityRepository
        >,
    ) {
        super(User, dataSource);

        this.identities = this.createHasManyRepositoryFactoryFor(
            'identities',
            thirdPartyRepositoryGetter,
        );

        this.registerInclusionResolver(
            'identities',
            this.identities.inclusionResolver,
        );
    }
}
