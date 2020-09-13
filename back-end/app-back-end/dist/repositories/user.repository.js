"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let UserRepository = class UserRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, coWorkingRepositoryGetter, bookingRepositoryGetter, cardRepositoryGetter) {
        super(models_1.User, dataSource);
        this.coWorkingRepositoryGetter = coWorkingRepositoryGetter;
        this.bookingRepositoryGetter = bookingRepositoryGetter;
        this.cardRepositoryGetter = cardRepositoryGetter;
        this.cards = this.createHasManyRepositoryFactoryFor('cards', cardRepositoryGetter);
        this.registerInclusionResolver('cards', this.cards.inclusionResolver);
        this.bookings = this.createHasManyRepositoryFactoryFor('bookings', bookingRepositoryGetter);
        this.registerInclusionResolver('bookings', this.bookings.inclusionResolver);
        this.coWorking = this.createHasOneRepositoryFactoryFor('coWorking', coWorkingRepositoryGetter);
        this.registerInclusionResolver('coWorking', this.coWorking.inclusionResolver);
    }
};
UserRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')),
    tslib_1.__param(1, repository_1.repository.getter('CoWorkingRepository')),
    tslib_1.__param(2, repository_1.repository.getter('BookingRepository')),
    tslib_1.__param(3, repository_1.repository.getter('CardRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, Function, Function])
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map