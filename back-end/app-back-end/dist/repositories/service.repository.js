"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepository = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const datasources_1 = require("../datasources");
const core_1 = require("@loopback/core");
let ServiceRepository = class ServiceRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, roomRepositoryGetter) {
        super(models_1.Service, dataSource);
        this.roomRepositoryGetter = roomRepositoryGetter;
        this.room = this.createBelongsToAccessorFor('room', roomRepositoryGetter);
        this.registerInclusionResolver('room', this.room.inclusionResolver);
    }
};
ServiceRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')), tslib_1.__param(1, repository_1.repository.getter('RoomRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function])
], ServiceRepository);
exports.ServiceRepository = ServiceRepository;
//# sourceMappingURL=service.repository.js.map