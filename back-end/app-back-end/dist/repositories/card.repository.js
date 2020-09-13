"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let CardRepository = class CardRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, userRepositoryGetter, exchangeCoinRepositoryGetter) {
        super(models_1.Card, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.exchangeCoinRepositoryGetter = exchangeCoinRepositoryGetter;
        this.exchangeCoins = this.createHasManyRepositoryFactoryFor('exchangeCoins', exchangeCoinRepositoryGetter);
        this.registerInclusionResolver('exchangeCoins', this.exchangeCoins.inclusionResolver);
        this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
    async isUniqueName(name) {
        const card = await this.findOne({ where: { name } });
        return card ? false : true;
    }
};
CardRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')),
    tslib_1.__param(1, repository_1.repository.getter('UserRepository')),
    tslib_1.__param(2, repository_1.repository.getter('ExchangeCoinRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, Function])
], CardRepository);
exports.CardRepository = CardRepository;
//# sourceMappingURL=card.repository.js.map