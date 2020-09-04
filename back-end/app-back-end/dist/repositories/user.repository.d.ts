import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { CoWorking, User, UserRelations } from '../models';
import { CoWorkingRepository } from './co-working.repository';
export declare class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id, UserRelations> {
    protected coWorkingRepositoryGetter: Getter<CoWorkingRepository>;
    readonly coWorking: HasOneRepositoryFactory<CoWorking, typeof User.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, coWorkingRepositoryGetter: Getter<CoWorkingRepository>);
}
