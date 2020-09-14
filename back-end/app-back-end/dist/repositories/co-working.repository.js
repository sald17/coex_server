"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoWorkingRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let CoWorkingRepository = class CoWorkingRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, userRepositoryGetter, roomRepositoryGetter, reviewRepositoryGetter) {
        super(models_1.CoWorking, dataSource);
        this.roomRepositoryGetter = roomRepositoryGetter;
        this.reviewRepositoryGetter = reviewRepositoryGetter;
        this.reviews = this.createHasManyRepositoryFactoryFor('reviews', reviewRepositoryGetter);
        this.registerInclusionResolver('reviews', this.reviews.inclusionResolver);
        this.rooms = this.createHasManyRepositoryFactoryFor('rooms', roomRepositoryGetter);
        this.registerInclusionResolver('rooms', this.rooms.inclusionResolver);
        this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
};
CoWorkingRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')),
    tslib_1.__param(1, repository_1.repository.getter('UserRepository')),
    tslib_1.__param(2, repository_1.repository.getter('RoomRepository')),
    tslib_1.__param(3, repository_1.repository.getter('ReviewRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, Function, Function])
], CoWorkingRepository);
exports.CoWorkingRepository = CoWorkingRepository;
//# sourceMappingURL=co-working.repository.js.map