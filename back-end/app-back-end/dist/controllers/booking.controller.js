"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const basic_authentication_1 = require("../access-control/authenticator/basic-authentication");
const constants_1 = require("../config/constants");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
const schedule_service_1 = require("../services/schedule.service");
// Check in cho phep tre 10 phut
// Check out cho phep tre 5 phut
let BookingController = class BookingController {
    constructor(bookingRepository, userRepository, roomRepository, transactionRepository, pointRepository, user) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.transactionRepository = transactionRepository;
        this.pointRepository = pointRepository;
        this.user = user;
    }
    // Get price of booking
    async getPrice(bookingInfo) {
        //Check user and room
        const user = await this.userRepository.findById(this.user[security_1.securityId]);
        const room = await this.roomRepository.findById(bookingInfo.roomId, {
            include: [{ relation: 'coWorking' }],
        });
        if (!user || !room) {
            throw new rest_1.HttpErrors.NotFound('Not Found User or Room');
        }
        // Validate booking
        const result = await this.bookingRepository.validateBooking(bookingInfo, room);
        return { price: this.bookingRepository.getBookingPrice(result, room) };
    }
    // Create Booking
    async create(bookingInfo) {
        //Check user and room
        const user = await this.userRepository.findById(this.user[security_1.securityId]);
        const room = await this.roomRepository.findById(bookingInfo.roomId, {
            include: [
                {
                    relation: 'coWorking',
                    scope: { include: [{ relation: 'user' }] },
                },
            ],
        });
        if (!this.user[security_1.securityId].localeCompare(room.coWorking.userId)) {
            throw new rest_1.HttpErrors.Unauthorized('Cannot book your own room.');
        }
        if (!user || !room) {
            throw new rest_1.HttpErrors.NotFound('Not Found User or Room');
        }
        // Validate booking
        const result = await this.bookingRepository.validateBooking(bookingInfo, room);
        result.userId = this.user[security_1.securityId];
        const booking = new models_1.Booking(result);
        const newBooking = await this.bookingRepository.create(booking);
        const newTransaction = await this.bookingRepository
            .transaction(newBooking.id)
            .create(new models_1.Transaction({
            price: this.bookingRepository.getBookingPrice(bookingInfo, room),
            bookingRefernce: await this.transactionRepository.getBookingReference(),
        }));
        newBooking.transaction = newTransaction;
        /**
         * Send Noti here
         */
        const host = room.coWorking.user;
        // Thong bao truoc gio check in 15 phut cho client va host
        schedule_service_1.ScheduleService.notifyCheckIn(newTransaction.bookingRefernce, newBooking.startTime, user, host);
        schedule_service_1.ScheduleService.notifyCheckOut(newTransaction.bookingRefernce, newBooking.startTime, user, host);
        // Notify host
        services_1.Firebase.notifyHostNewBooking(room.coWorking.user.firebaseToken, room.name, newTransaction.bookingRefernce);
        // Cancel booking if user not check in late 10 mins
        schedule_service_1.ScheduleService.verifyCheckIn(newBooking.id, newBooking.startTime);
        return newBooking;
    }
    // Get booking history
    async getHistory() {
        return this.bookingRepository.find({
            where: { userId: this.user[security_1.securityId] },
            include: [{ relation: 'transaction' }],
        });
    }
    // Get booking, add query params date=YYYY-MM-DD to find booking by date
    async find(date) {
        if (date) {
            return this.bookingRepository.findBookingByDate(date);
        }
        return this.bookingRepository.find();
    }
    async findById(id, filter) {
        return this.bookingRepository.findById(id, filter);
    }
    async updateById(id, updatedBooking) {
        const booking = await this.bookingRepository.findById(id, {
            include: [
                { relation: 'room', scope: { include: [{ relation: 'coWorking' }] } },
                { relation: 'transaction' },
            ],
        });
        if (this.user[security_1.securityId].localeCompare(booking.userId)) {
            throw new rest_1.HttpErrors.Unauthorized();
        }
        if (booking.status === constants_1.BookingConstant.FINISH ||
            booking.status === constants_1.BookingConstant.CANCELED ||
            booking.transaction.payment ||
            booking.transaction.checkIn ||
            booking.transaction.checkOut) {
            throw new rest_1.HttpErrors.BadRequest('Cannot update this booking');
        }
        const room = await this.roomRepository.findById(booking.roomId);
        let validated = await this.bookingRepository.validateBooking(updatedBooking, room);
        const timestamp = Date();
        await this.transactionRepository.updateById(booking.transaction.id, {
            modifiedAt: timestamp,
            price: this.bookingRepository.getBookingPrice(updatedBooking, room),
        });
        validated.modifiedAt = timestamp;
        let r = await this.bookingRepository.updateById(id, validated);
        /**
         * Add noti here
         */
        return r;
    }
    //Cancel booking
    async cancelBooking(id) {
        const booking = await this.bookingRepository.findById(id, {
            include: [
                { relation: 'room', scope: { include: [{ relation: 'coWorking' }] } },
                { relation: 'transaction' },
            ],
        });
        if (this.user[security_1.securityId].localeCompare(booking.userId)) {
            throw new rest_1.HttpErrors.Unauthorized();
        }
        if (booking.status === constants_1.BookingConstant.FINISH ||
            booking.status === constants_1.BookingConstant.CANCELED ||
            booking.status === constants_1.BookingConstant.ON_GOING ||
            booking.transaction.payment ||
            booking.transaction.checkIn ||
            booking.transaction.checkOut) {
            throw new rest_1.HttpErrors.BadRequest('Cannot cancel this booking');
        }
        if (booking.startTime.getTime() < Date.now()) {
            throw new rest_1.HttpErrors.BadRequest('Canot cancel. Booking is over due.');
        }
        booking.status = constants_1.BookingConstant.CANCELED;
        booking.modifiedAt = new Date();
        delete booking.room;
        delete booking.transaction;
        await this.bookingRepository.update(booking);
    }
    //Check in
    async checkIn(id) {
        const booking = await this.bookingRepository.findById(id, {
            include: [
                { relation: 'room', scope: { include: [{ relation: 'coWorking' }] } },
                { relation: 'transaction' },
            ],
        });
        if (this.user[security_1.securityId].localeCompare(booking.room.coWorking.userId)) {
            throw new rest_1.HttpErrors.Unauthorized();
        }
        // Ktra thoi gian, cho phep tre 10 phut
        if (Date.now() - booking.startTime.getTime() >= 1000 * 60 * 10) {
            throw new rest_1.HttpErrors.BadRequest('Late for checkin');
        }
        if (booking.status !== constants_1.BookingConstant.PENDING ||
            booking.transaction.payment ||
            booking.transaction.checkIn ||
            booking.transaction.checkOut) {
            throw new rest_1.HttpErrors.BadRequest(`Cannot cancel this booking. Status: ${booking.status}`);
        }
        const timestamp = new Date();
        await this.transactionRepository.updateById(booking.transaction.id, {
            checkInTime: timestamp,
            checkIn: true,
            modifiedAt: timestamp,
        });
        booking.status = constants_1.BookingConstant.ON_GOING;
        delete booking.room;
        delete booking.transaction;
        await this.bookingRepository.update(booking);
    }
    //Checkout
    async checkOut(id) {
        const booking = await this.bookingRepository.findById(id, {
            include: [
                { relation: 'room', scope: { include: [{ relation: 'coWorking' }] } },
                { relation: 'transaction' },
            ],
        });
        if (this.user[security_1.securityId].localeCompare(booking.room.coWorking.userId)) {
            throw new rest_1.HttpErrors.Unauthorized();
        }
        // ????????? need re check TH user khong check out
        // Ktra thoi gian, cho phep tre 5 phut
        if (Date.now() - booking.endTime.getTime() >= 1000 * 60 * 5) {
            throw new rest_1.HttpErrors.BadRequest('Late for check out');
        }
        if (booking.status !== constants_1.BookingConstant.ON_GOING) {
            throw new rest_1.HttpErrors.BadRequest(`Cannot cancel this booking. Status: ${booking.status}`);
        }
        if (!booking.transaction.checkIn) {
            throw new rest_1.HttpErrors.BadRequest(`User hasn't checked in.`);
        }
        if (booking.transaction.checkOut) {
            throw new rest_1.HttpErrors.BadRequest(`User already checked out.`);
        }
        const earnPoint = Math.floor(booking.transaction.price / constants_1.PointConstant.CashToPoint);
        const timestamp = new Date();
        const transactionId = booking.transaction.id;
        // UPdate booking and transaction
        await this.transactionRepository.updateById(booking.transaction.id, {
            checkOutTime: timestamp,
            checkOut: true,
            earnPoint: earnPoint,
            payment: true,
            modifiedAt: timestamp,
        });
        booking.status = constants_1.BookingConstant.FINISH;
        delete booking.room;
        delete booking.transaction;
        await this.bookingRepository.update(booking);
        // Update user point
        const user = await this.userRepository.findById(this.user[security_1.securityId]);
        user.point += earnPoint;
        await this.userRepository.update(user);
        // Update history exchange Point
        await this.pointRepository.create({
            createdAt: timestamp,
            type: constants_1.PointConstant.EXCHANGE_TYPE.BOOKING,
            point: earnPoint,
            transactionId: transactionId,
            userId: this.user[security_1.securityId],
        });
    }
};
tslib_1.__decorate([
    authorization_1.authorize({
        allowedRoles: ['client'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.post('/bookings/price', {
        responses: {
            '200': {
                description: 'Booking model instance',
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "getPrice", null);
tslib_1.__decorate([
    authorization_1.authorize({
        allowedRoles: ['client'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.post('/bookings', {
        responses: {
            '200': {
                description: 'Booking model instance',
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "create", null);
tslib_1.__decorate([
    authorization_1.authorize({
        allowedRoles: ['client'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.get('/bookings/history', {
        responses: {
            '200': {
                description: 'Booking model count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "getHistory", null);
tslib_1.__decorate([
    rest_1.get('/bookings', {
        responses: {
            '200': {
                description: 'Array of Booking model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: rest_1.getModelSchemaRef(models_1.Booking, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('date')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "find", null);
tslib_1.__decorate([
    rest_1.get('/bookings/{id}', {
        responses: {
            '200': {
                description: 'Booking model instance',
                content: {
                    'application/json': {
                        schema: rest_1.getModelSchemaRef(models_1.Booking, {
                            includeRelations: true,
                        }),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Booking, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "findById", null);
tslib_1.__decorate([
    authorization_1.authorize({
        allowedRoles: ['client'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    rest_1.patch('/bookings/{id}', {
        responses: {
            '204': {
                description: 'Booking PATCH success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "updateById", null);
tslib_1.__decorate([
    rest_1.patch('/bookings/cancel/{id}'),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "cancelBooking", null);
tslib_1.__decorate([
    rest_1.patch('/bookings/checkin/{id}'),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "checkIn", null);
tslib_1.__decorate([
    rest_1.patch('/bookings/checkout/{id}'),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], BookingController.prototype, "checkOut", null);
BookingController = tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    tslib_1.__param(0, repository_1.repository(repositories_1.BookingRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(2, repository_1.repository(repositories_1.RoomRepository)),
    tslib_1.__param(3, repository_1.repository(repositories_1.TransactionRepository)),
    tslib_1.__param(4, repository_1.repository(repositories_1.ExchangePointRepository)),
    tslib_1.__param(5, core_1.inject(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BookingRepository,
        repositories_1.UserRepository,
        repositories_1.RoomRepository,
        repositories_1.TransactionRepository,
        repositories_1.ExchangePointRepository, Object])
], BookingController);
exports.BookingController = BookingController;
//# sourceMappingURL=booking.controller.js.map