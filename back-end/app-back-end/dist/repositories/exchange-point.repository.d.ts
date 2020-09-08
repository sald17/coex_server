import { DefaultCrudRepository, BelongsToAccessor } from '@loopback/repository';
import { ExchangePoint, ExchangePointRelations, Transaction, User } from '../models';
import { MongoConnectorDataSource } from '../datasources';
import { Getter } from '@loopback/core';
import { TransactionRepository } from './transaction.repository';
import { UserRepository } from './user.repository';
export declare class ExchangePointRepository extends DefaultCrudRepository<ExchangePoint, typeof ExchangePoint.prototype.id, ExchangePointRelations> {
    protected transactionRepositoryGetter: Getter<TransactionRepository>;
    protected userRepositoryGetter: Getter<UserRepository>;
    readonly transaction: BelongsToAccessor<Transaction, typeof ExchangePoint.prototype.id>;
    readonly user: BelongsToAccessor<User, typeof ExchangePoint.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, transactionRepositoryGetter: Getter<TransactionRepository>, userRepositoryGetter: Getter<UserRepository>);
}
