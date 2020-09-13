import { Getter } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { Card, CardRelations, User, ExchangeCoin } from '../models';
import { UserRepository } from './user.repository';
import { ExchangeCoinRepository } from './exchange-coin.repository';
export declare class CardRepository extends DefaultCrudRepository<Card, typeof Card.prototype.id, CardRelations> {
    protected userRepositoryGetter: Getter<UserRepository>;
    protected exchangeCoinRepositoryGetter: Getter<ExchangeCoinRepository>;
    readonly user: BelongsToAccessor<User, typeof Card.prototype.id>;
    readonly exchangeCoins: HasManyRepositoryFactory<ExchangeCoin, typeof Card.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, userRepositoryGetter: Getter<UserRepository>, exchangeCoinRepositoryGetter: Getter<ExchangeCoinRepository>);
    isUniqueName(name: string | undefined): Promise<boolean>;
}
