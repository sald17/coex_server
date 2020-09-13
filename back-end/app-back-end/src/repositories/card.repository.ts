import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {Card, CardRelations, User, ExchangeCoin} from '../models';
import {UserRepository} from './user.repository';
import {ExchangeCoinRepository} from './exchange-coin.repository';

export class CardRepository extends DefaultCrudRepository<
    Card,
    typeof Card.prototype.id,
    CardRelations
> {
    public readonly user: BelongsToAccessor<User, typeof Card.prototype.id>;

  public readonly exchangeCoins: HasManyRepositoryFactory<ExchangeCoin, typeof Card.prototype.id>;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('UserRepository')
        protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ExchangeCoinRepository') protected exchangeCoinRepositoryGetter: Getter<ExchangeCoinRepository>,
    ) {
        super(Card, dataSource);
      this.exchangeCoins = this.createHasManyRepositoryFactoryFor('exchangeCoins', exchangeCoinRepositoryGetter,);
      this.registerInclusionResolver('exchangeCoins', this.exchangeCoins.inclusionResolver);
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter,
        );
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }

    async isUniqueName(name: string | undefined) {
        const card = await this.findOne({where: {name}});
        return card ? false : true;
    }
}
