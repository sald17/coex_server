"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
const file_upload_1 = require("../services/file-upload");
const service_repository_1 = require("./service.repository");
let RoomRepository = class RoomRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, serviceRepositoryGetter, serviceRepository, bookingRepositoryGetter, coWorkingRepositoryGetter) {
        super(models_1.Room, dataSource);
        this.serviceRepositoryGetter = serviceRepositoryGetter;
        this.serviceRepository = serviceRepository;
        this.bookingRepositoryGetter = bookingRepositoryGetter;
        this.coWorkingRepositoryGetter = coWorkingRepositoryGetter;
        this.coWorking = this.createBelongsToAccessorFor('coWorking', coWorkingRepositoryGetter);
        this.registerInclusionResolver('coWorking', this.coWorking.inclusionResolver);
        this.bookings = this.createHasManyRepositoryFactoryFor('bookings', bookingRepositoryGetter);
        this.registerInclusionResolver('bookings', this.bookings.inclusionResolver);
        this.service = this.createHasOneRepositoryFactoryFor('service', serviceRepositoryGetter);
        this.registerInclusionResolver('service', this.service.inclusionResolver);
    }
    async deleteRoom(id) {
        const room = await this.findById(id, {
            include: [{ relation: 'service' }],
        });
        file_upload_1.deleteFiles(room.photo);
        await this.serviceRepository.deleteById(room.service.id);
        delete room.service;
        await this.delete(room);
    }
};
RoomRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')),
    tslib_1.__param(1, repository_1.repository.getter('ServiceRepository')),
    tslib_1.__param(2, repository_1.repository(service_repository_1.ServiceRepository)),
    tslib_1.__param(3, repository_1.repository.getter('BookingRepository')), tslib_1.__param(4, repository_1.repository.getter('CoWorkingRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, service_repository_1.ServiceRepository, Function, Function])
], RoomRepository);
exports.RoomRepository = RoomRepository;
//# sourceMappingURL=room.repository.js.map