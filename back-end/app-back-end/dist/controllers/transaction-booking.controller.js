"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBookingController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let TransactionBookingController = class TransactionBookingController {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async getBooking(id) {
        return this.transactionRepository.booking(id);
    }
};
tslib_1.__decorate([
    rest_1.get('/transactions/{id}/booking', {
        responses: {
            '200': {
                description: 'Booking belonging to Transaction',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: rest_1.getModelSchemaRef(models_1.Booking),
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionBookingController.prototype, "getBooking", null);
TransactionBookingController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.TransactionRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.TransactionRepository])
], TransactionBookingController);
exports.TransactionBookingController = TransactionBookingController;
//# sourceMappingURL=transaction-booking.controller.js.map