"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingTransactionController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let BookingTransactionController = class BookingTransactionController {
    constructor(bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    async get(id, filter) {
        return this.bookingRepository.transaction(id).get(filter);
    }
    async create(id, transaction) {
        return this.bookingRepository.transaction(id).create(transaction);
    }
    async patch(id, transaction, where) {
        return this.bookingRepository.transaction(id).patch(transaction, where);
    }
    async delete(id, where) {
        return this.bookingRepository.transaction(id).delete(where);
    }
};
tslib_1.__decorate([
    rest_1.get('/bookings/{id}/transaction', {
        responses: {
            '200': {
                description: 'Booking has one Transaction',
                content: {
                    'application/json': {
                        schema: rest_1.getModelSchemaRef(models_1.Transaction),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('filter')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingTransactionController.prototype, "get", null);
tslib_1.__decorate([
    rest_1.post('/bookings/{id}/transaction', {
        responses: {
            '200': {
                description: 'Booking model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.Transaction) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Transaction, {
                    title: 'NewTransactionInBooking',
                    exclude: ['id'],
                    optional: ['bookingId']
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingTransactionController.prototype, "create", null);
tslib_1.__decorate([
    rest_1.patch('/bookings/{id}/transaction', {
        responses: {
            '200': {
                description: 'Booking.Transaction PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Transaction, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Transaction))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingTransactionController.prototype, "patch", null);
tslib_1.__decorate([
    rest_1.del('/bookings/{id}/transaction', {
        responses: {
            '200': {
                description: 'Booking.Transaction DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Transaction))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingTransactionController.prototype, "delete", null);
BookingTransactionController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.BookingRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BookingRepository])
], BookingTransactionController);
exports.BookingTransactionController = BookingTransactionController;
//# sourceMappingURL=booking-transaction.controller.js.map