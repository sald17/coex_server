"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const constants_1 = require("../config/constants");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
const date_utils_1 = require("../services/date-utils");
let BookingRepository = class BookingRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, userRepositoryGetter, roomRepositoryGetter, transactionRepositoryGetter) {
        super(models_1.Booking, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.roomRepositoryGetter = roomRepositoryGetter;
        this.transactionRepositoryGetter = transactionRepositoryGetter;
        this.transaction = this.createHasOneRepositoryFactoryFor('transaction', transactionRepositoryGetter);
        this.registerInclusionResolver('transaction', this.transaction.inclusionResolver);
        this.room = this.createBelongsToAccessorFor('room', roomRepositoryGetter);
        this.registerInclusionResolver('room', this.room.inclusionResolver);
        this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
    /**
     * Check if sent booking is valid and return a standard model to add to db
     * @param userId
     * @param bookingInfo
     * @param userRepository
     * @param roomRepository
     */
    async validateBooking(bookingInfo, room) {
        bookingInfo.startTime = date_utils_1.stringToDate(bookingInfo.startTime);
        bookingInfo.endTime = new Date(bookingInfo.startTime.getTime() +
            bookingInfo.duration * 3600 * 1000);
        // check time
        if (bookingInfo.startTime < Date.now() ||
            bookingInfo.startTime > bookingInfo.endTime) {
            throw new rest_1.HttpErrors.BadRequest('Invalid timestamps');
        }
        // check room's capacity
        const timeFilter = constants_1.filterTimeBooking(bookingInfo.startTime, bookingInfo.endTime);
        const listBookingInTime = await this.find({
            where: timeFilter,
        });
        // console.log(bookingInfo.startTime);
        // console.log(bookingInfo.endTime);
        // console.log(listBookingInTime.length);
        if (listBookingInTime && listBookingInTime.length !== 0) {
            // Kiểm tra nếu như có người đã đặt phòng trong khoảng thời gian muốn.
            for (let booking of listBookingInTime) {
                if (booking.status === constants_1.BookingConstant.FINISH ||
                    booking.status === constants_1.BookingConstant.CANCELED)
                    continue;
                if (booking.numPerson + bookingInfo.numPerson >
                    room.maxPerson) {
                    throw new rest_1.HttpErrors.BadRequest('Not enough capacity.');
                }
            }
        }
        else {
            // Nếu phòng trống, ktra số lượng người cho phép thuê
            if (bookingInfo.numPerson > room.maxPerson) {
                throw new rest_1.HttpErrors.BadRequest('Not enough capacity.');
            }
        }
        // console.log(new Date(bookingInfo.startTime.toISOString()));
        return Object.assign({}, bookingInfo, {});
    }
    /**
     * Find booking by date
     */
    async findBookingByDate(date, { user, room }) {
        date = date.concat('-0-0');
        const startDate = date_utils_1.stringToDate(date, false);
        const endDate = new Date(startDate.getTime() + 1000 * 3600 * 24);
        const whereCond = {
            or: [
                {
                    and: [
                        {
                            startTime: {
                                gte: startDate,
                            },
                        },
                        {
                            startTime: {
                                lt: endDate,
                            },
                        },
                    ],
                },
                {
                    and: [
                        {
                            endTime: {
                                gte: startDate,
                            },
                        },
                        {
                            endTime: {
                                lt: endDate,
                            },
                        },
                    ],
                },
            ],
        };
        if (user) {
            whereCond.userId = user;
        }
        else if (room) {
            whereCond.roomId = room;
        }
        return this.find({
            where: whereCond,
            include: [
                {
                    relation: 'transaction',
                },
                {
                    relation: 'room',
                    scope: {
                        include: [
                            { relation: 'coWorking' },
                            { relation: 'service' },
                        ],
                    },
                },
                {
                    relation: 'user',
                    scope: {
                        fields: {
                            id: true,
                            fullname: true,
                            email: true,
                            phoneNumber: true,
                        },
                    },
                },
            ],
        });
    }
    /**
     * Get price of booking
     */
    getBookingPrice(bookingInfo, room) {
        return bookingInfo.numPerson * bookingInfo.duration * room.price;
    }
};
BookingRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.MongoConnector')),
    tslib_1.__param(1, repository_1.repository.getter('UserRepository')),
    tslib_1.__param(2, repository_1.repository.getter('RoomRepository')),
    tslib_1.__param(3, repository_1.repository.getter('TransactionRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.MongoConnectorDataSource, Function, Function, Function])
], BookingRepository);
exports.BookingRepository = BookingRepository;
//# sourceMappingURL=booking.repository.js.map