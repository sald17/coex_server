import { DefaultCrudRepository } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { User, UserRelations } from '../models';
export declare class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id, UserRelations> {
    constructor(dataSource: MongoConnectorDataSource);
}
