import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    repository,
} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {ThirdPartyIdentity, ThirdPartyIdentityRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class ThirdPartyIdentityRepository extends DefaultCrudRepository<
    ThirdPartyIdentity,
    typeof ThirdPartyIdentity.prototype.id,
    ThirdPartyIdentityRelations
> {
    public readonly user: BelongsToAccessor<
        User,
        typeof ThirdPartyIdentity.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('UserRepository')
        userRepositoryGetter: Getter<UserRepository>,
    ) {
        super(ThirdPartyIdentity, dataSource);
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter,
        );
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
}
