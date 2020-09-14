"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let ReviewRepository = class ReviewRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, userRepositoryGetter, coWorkingRepositoryGetter) {
        super(models_1.Review, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.coWorkingRepositoryGetter = coWorkingRepositoryGetter;
        this.coWorking = this.createBelongsToAccessorFor('coWorking', coWorkingRepositoryGetter);
        this.registerInclusionResolver('coWorking', this.coWorking.inclusionResolver);
        this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
    async isUserReviewed(userId, cwId) {
        const review = await this.findOne({
            where: {
                userId,
                coWorkingId: cwId,
            },
        });
        return review ? true : false;
    }
};
ReviewRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')),
    tslib_1.__param(1, repository_1.repository.getter('UserRepository')),
    tslib_1.__param(2, repository_1.repository.getter('CoWorkingRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, Function])
], ReviewRepository);
exports.ReviewRepository = ReviewRepository;
//# sourceMappingURL=review.repository.js.map