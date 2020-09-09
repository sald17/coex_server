"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const _1 = require(".");
const constants_1 = require("../config/constants");
class ScheduleService {
    constructor(userRepository, bookingRepository, transactionRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.transactionRepository = transactionRepository;
    }
    async define() {
        // Remind check in
        ScheduleService.agenda.define(constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION, async (job) => {
            try {
                const data = job.attrs.data;
                _1.Firebase.remindCheckInClient(data.user.firebaseToken, data.bookingRef, data.before);
                _1.Firebase.remindCheckInHost(data.host.firebaseToken, data.user.fullname, data.bookingRef, data.before);
            }
            catch (err) {
                console.log(err);
            }
        });
        // Remind check out
        ScheduleService.agenda.define(constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION, async (job) => {
            try {
                const data = job.attrs.data;
                _1.Firebase.remindCheckOutClient(data.user.firebaseToken, data.bookingRef, data.before);
                _1.Firebase.remindCheckOutHost(data.host.firebaseToken, data.user.fullname, data.bookingRef, data.before);
            }
            catch (err) {
                console.log(err);
            }
        });
        // Verify check in, if late 10 min then cancel booking
        ScheduleService.agenda.define(constants_1.ScheduleConstant.VERIFY_CHECK_IN, async (job) => {
            try {
                const data = job.attrs.data;
                const booking = await this.bookingRepository.findById(data.id, {
                    include: [
                        {
                            relation: 'transaction',
                        },
                        {
                            relation: 'user',
                        },
                        {
                            relation: 'room',
                            scope: {
                                include: [
                                    {
                                        relation: 'coWorking',
                                        scope: {
                                            include: [
                                                { relation: 'user' },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                });
                if (booking.status !== constants_1.BookingConstant.ON_GOING ||
                    !booking.transaction.checkIn) {
                    booking.status = constants_1.BookingConstant.CANCELED;
                    _1.Firebase.notifyClientCheckInOverTime(booking.user.firebaseToken, booking.transaction.bookingRefernce);
                    _1.Firebase.notifyHostCheckInOverTime(booking.room.coWorking.user.firebaseToken, booking.transaction.bookingRefernce);
                }
                delete booking.transaction;
                delete booking.room;
                delete booking.user;
                const r = await this.bookingRepository.update(booking);
            }
            catch (error) {
                console.log(error);
            }
        });
        // Verify check out, if late 5 min then cancel booking
        ScheduleService.agenda.define(constants_1.ScheduleConstant.VERIFY_CHECK_OUT, async (job) => {
            try {
                const data = job.attrs.data;
                const booking = await this.bookingRepository.findById(data.id, {
                    include: [
                        {
                            relation: 'transaction',
                        },
                        {
                            relation: 'user',
                        },
                        {
                            relation: 'room',
                            scope: {
                                include: [
                                    {
                                        relation: 'coWorking',
                                        scope: {
                                            include: [
                                                { relation: 'user' },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                });
                if (booking.status !== constants_1.BookingConstant.FINISH ||
                    !booking.transaction.checkOut) {
                    booking.status = constants_1.BookingConstant.FAIL;
                    _1.Firebase.notifyClientCheckInOverTime(booking.user.firebaseToken, booking.transaction.bookingRefernce);
                    _1.Firebase.notifyHostCheckInOverTime(booking.room.coWorking.user.firebaseToken, booking.transaction.bookingRefernce);
                }
                delete booking.transaction;
                delete booking.room;
                delete booking.user;
                const r = await this.bookingRepository.update(booking);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static async notifyCheckIn(bookingRef, startTime, user, host, before = 15) {
        const notifyTime = new Date(startTime.getTime() - 1000 * 60 * before);
        ScheduleService.agenda.schedule(notifyTime, constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION, { bookingRef, startTime, before, user, host });
    }
    static async notifyCheckOut(bookingRef, endTime, user, host, before = 15) {
        const notifyTime = new Date(endTime.getTime() - 1000 * 60 * before);
        ScheduleService.agenda.schedule(notifyTime, constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION, { bookingRef, endTime, before, user, host });
    }
    static async verifyCheckIn(id, startTime) {
        const checkTime = new Date(startTime.getTime() + 1000 * 69 * 10);
        ScheduleService.agenda.schedule(checkTime, constants_1.ScheduleConstant.VERIFY_CHECK_IN, { id, startTime });
    }
    static async verifyCheckOut(id, endTime) {
        const checkTime = new Date(endTime.getTime() + 1000 * 60 * 5);
        ScheduleService.agenda.schedule(checkTime, constants_1.ScheduleConstant.VERIFY_CHECK_OUT, { id, endTime });
    }
}
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=schedule.service.js.map