import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { ThirdPartyIdentity, User, UserRelations } from '../models';
import { ThirdPartyIdentityRepository } from './third-party-identity.repository';
export declare class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id, UserRelations> {
    protected thirdPartyRepositoryGetter: Getter<ThirdPartyIdentityRepository>;
    readonly identities: HasManyRepositoryFactory<ThirdPartyIdentity, typeof ThirdPartyIdentity.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, thirdPartyRepositoryGetter: Getter<ThirdPartyIdentityRepository>);
}
