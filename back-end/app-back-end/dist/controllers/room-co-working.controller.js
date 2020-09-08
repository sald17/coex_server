"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomCoWorkingController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let RoomCoWorkingController = class RoomCoWorkingController {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async getCoWorking(id) {
        return this.roomRepository.coWorking(id);
    }
};
tslib_1.__decorate([
    rest_1.get('/rooms/{id}/co-working', {
        responses: {
            '200': {
                description: 'CoWorking belonging to Room',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.CoWorking) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoomCoWorkingController.prototype, "getCoWorking", null);
RoomCoWorkingController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.RoomRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.RoomRepository])
], RoomCoWorkingController);
exports.RoomCoWorkingController = RoomCoWorkingController;
//# sourceMappingURL=room-co-working.controller.js.map