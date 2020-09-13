import { DefaultCrudRepository, BelongsToAccessor } from '@loopback/repository';
import { ExchangeCoin, ExchangeCoinRelations, Card, User } from '../models';
import { MongoConnectorDataSource } from '../datasources';
import { Getter } from '@loopback/core';
import { CardRepository } from './card.repository';
import { UserRepository } from './user.repository';
export declare class ExchangeCoinRepository extends DefaultCrudRepository<ExchangeCoin, typeof ExchangeCoin.prototype.id, ExchangeCoinRelations> {
    protected cardRepositoryGetter: Getter<CardRepository>;
    protected userRepositoryGetter: Getter<UserRepository>;
    readonly card: BelongsToAccessor<Card, typeof ExchangeCoin.prototype.id>;
    readonly user: BelongsToAccessor<User, typeof ExchangeCoin.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, cardRepositoryGetter: Getter<CardRepository>, userRepositoryGetter: Getter<UserRepository>);
}
