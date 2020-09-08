import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {ExchangePoint, ExchangePointRelations, Transaction, User} from '../models';
import {MongoConnectorDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TransactionRepository} from './transaction.repository';
import {UserRepository} from './user.repository';

export class ExchangePointRepository extends DefaultCrudRepository<
  ExchangePoint,
  typeof ExchangePoint.prototype.id,
  ExchangePointRelations
> {

  public readonly transaction: BelongsToAccessor<Transaction, typeof ExchangePoint.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof ExchangePoint.prototype.id>;

  constructor(
    @inject('datasources.MongoConnector') dataSource: MongoConnectorDataSource, @repository.getter('TransactionRepository') protected transactionRepositoryGetter: Getter<TransactionRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(ExchangePoint, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.transaction = this.createBelongsToAccessorFor('transaction', transactionRepositoryGetter,);
    this.registerInclusionResolver('transaction', this.transaction.inclusionResolver);
  }
}
