"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let RoomRepository = class RoomRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, serviceRepositoryGetter) {
        super(models_1.Room, dataSource);
        this.serviceRepositoryGetter = serviceRepositoryGetter;
        this.service = this.createHasOneRepositoryFactoryFor('service', serviceRepositoryGetter);
        this.registerInclusionResolver('service', this.service.inclusionResolver);
    }
};
RoomRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')),
    tslib_1.__param(1, repository_1.repository.getter('ServiceRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function])
], RoomRepository);
exports.RoomRepository = RoomRepository;
//# sourceMappingURL=room.repository.js.map