import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {ExchangeCoin, ExchangeCoinRelations, Card, User} from '../models';
import {MongoConnectorDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CardRepository} from './card.repository';
import {UserRepository} from './user.repository';

export class ExchangeCoinRepository extends DefaultCrudRepository<
  ExchangeCoin,
  typeof ExchangeCoin.prototype.id,
  ExchangeCoinRelations
> {

  public readonly card: BelongsToAccessor<Card, typeof ExchangeCoin.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof ExchangeCoin.prototype.id>;

  constructor(
    @inject('datasources.MongoConnector') dataSource: MongoConnectorDataSource, @repository.getter('CardRepository') protected cardRepositoryGetter: Getter<CardRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(ExchangeCoin, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.card = this.createBelongsToAccessorFor('card', cardRepositoryGetter,);
    this.registerInclusionResolver('card', this.card.inclusionResolver);
  }
}
