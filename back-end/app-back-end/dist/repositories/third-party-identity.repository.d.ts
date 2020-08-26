import { Getter } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { ThirdPartyIdentity, ThirdPartyIdentityRelations, User } from '../models';
import { UserRepository } from './user.repository';
export declare class ThirdPartyIdentityRepository extends DefaultCrudRepository<ThirdPartyIdentity, typeof ThirdPartyIdentity.prototype.id, ThirdPartyIdentityRelations> {
    readonly user: BelongsToAccessor<User, typeof ThirdPartyIdentity.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, userRepositoryGetter: Getter<UserRepository>);
}
