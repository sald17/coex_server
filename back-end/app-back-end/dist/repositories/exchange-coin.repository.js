"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeCoinRepository = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const datasources_1 = require("../datasources");
const core_1 = require("@loopback/core");
let ExchangeCoinRepository = class ExchangeCoinRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, cardRepositoryGetter, userRepositoryGetter) {
        super(models_1.ExchangeCoin, dataSource);
        this.cardRepositoryGetter = cardRepositoryGetter;
        this.userRepositoryGetter = userRepositoryGetter;
        this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
        this.card = this.createBelongsToAccessorFor('card', cardRepositoryGetter);
        this.registerInclusionResolver('card', this.card.inclusionResolver);
    }
};
ExchangeCoinRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')), tslib_1.__param(1, repository_1.repository.getter('CardRepository')), tslib_1.__param(2, repository_1.repository.getter('UserRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, Function])
], ExchangeCoinRepository);
exports.ExchangeCoinRepository = ExchangeCoinRepository;
//# sourceMappingURL=exchange-coin.repository.js.map