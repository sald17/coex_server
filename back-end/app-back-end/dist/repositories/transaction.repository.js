"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let TransactionRepository = class TransactionRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, bookingRepositoryGetter) {
        super(models_1.Transaction, dataSource);
        this.bookingRepositoryGetter = bookingRepositoryGetter;
        this.booking = this.createBelongsToAccessorFor('booking', bookingRepositoryGetter);
        this.registerInclusionResolver('booking', this.booking.inclusionResolver);
    }
    async getBookingReference() {
        let ref = Math.floor(Math.random() * 1000000) + '';
        while ((await this.findOne({ where: { bookingRefernce: ref } })) === undefined) {
            ref = Math.floor(Math.random() * 100000) + '';
        }
        return ref;
    }
};
TransactionRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')),
    tslib_1.__param(1, repository_1.repository.getter('BookingRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function])
], TransactionRepository);
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map