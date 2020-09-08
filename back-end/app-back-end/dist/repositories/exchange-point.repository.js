"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangePointRepository = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const datasources_1 = require("../datasources");
const core_1 = require("@loopback/core");
let ExchangePointRepository = class ExchangePointRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, transactionRepositoryGetter, userRepositoryGetter) {
        super(models_1.ExchangePoint, dataSource);
        this.transactionRepositoryGetter = transactionRepositoryGetter;
        this.userRepositoryGetter = userRepositoryGetter;
        this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
        this.transaction = this.createBelongsToAccessorFor('transaction', transactionRepositoryGetter);
        this.registerInclusionResolver('transaction', this.transaction.inclusionResolver);
    }
};
ExchangePointRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')), tslib_1.__param(1, repository_1.repository.getter('TransactionRepository')), tslib_1.__param(2, repository_1.repository.getter('UserRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, Function])
], ExchangePointRepository);
exports.ExchangePointRepository = ExchangePointRepository;
//# sourceMappingURL=exchange-point.repository.js.map