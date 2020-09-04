"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoWorkingRoomController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let CoWorkingRoomController = class CoWorkingRoomController {
    constructor(coWorkingRepository) {
        this.coWorkingRepository = coWorkingRepository;
    }
    // @post('/co-workings/{id}/rooms', {
    //     responses: {
    //         '200': {
    //             description: 'CoWorking model instance',
    //             content: {
    //                 'application/json': {schema: getModelSchemaRef(Room)},
    //             },
    //         },
    //     },
    // })
    // async create(
    //     @param.path.string('id') id: typeof CoWorking.prototype.id,
    //     @requestBody({
    //         content: {
    //             'application/json': {
    //                 schema: getModelSchemaRef(Room, {
    //                     title: 'NewRoomInCoWorking',
    //                     exclude: ['id'],
    //                     optional: ['coWorkingId'],
    //                 }),
    //             },
    //         },
    //     })
    //     room: Omit<Room, 'id'>,
    // ): Promise<Room> {
    //     return this.coWorkingRepository.rooms(id).create(room);
    // }
    async patch(id, room, where) {
        return this.coWorkingRepository.rooms(id).patch(room, where);
    }
    async delete(id, where) {
        return this.coWorkingRepository.rooms(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.patch('/co-workings/{id}/rooms', {
        responses: {
            '200': {
                description: 'CoWorking.Room PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Room, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Room))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingRoomController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/co-workings/{id}/rooms', {
        responses: {
            '200': {
                description: 'CoWorking.Room DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Room))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CoWorkingRoomController.prototype, "delete", null);
CoWorkingRoomController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.CoWorkingRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CoWorkingRepository])
], CoWorkingRoomController);
exports.CoWorkingRoomController = CoWorkingRoomController;
//# sourceMappingURL=co-working-room.controller.js.map