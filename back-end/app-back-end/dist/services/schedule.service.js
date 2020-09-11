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
    static async cancelSchedule(name) {
        ScheduleService.agenda.cancel({ name });
    }
    static async notifyCheckIn(bookingRef, startTime, user, host, before = 15) {
        const time = startTime.getTime();
        const beforeTime = 1000 * 60 * before;
        const now = Date.now();
        let notifyTime = new Date(time - beforeTime);
        if (time - now <= beforeTime) {
            before = Math.floor((time - now) / (1000 * 60));
        }
        console.log(`Set up checkin reminder #${bookingRef}: ${notifyTime}`);
        ScheduleService.agenda.define(`${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`, async (job) => {
            console.log(`${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`);
            try {
                const data = job.attrs.data;
                _1.Firebase.remindCheckInClient(data.user.firebaseToken, data.bookingRef, data.before);
                _1.Firebase.remindCheckInHost(data.host.firebaseToken, data.user.fullname, data.bookingRef, data.before);
            }
            catch (err) {
                console.log(err);
            }
        });
        ScheduleService.agenda.schedule(notifyTime, `${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`, { bookingRef, startTime, before, user, host });
    }
    static async notifyCheckOut(bookingRef, endTime, user, host, before = 15) {
        const time = endTime.getTime();
        const beforeTime = 1000 * 60 * before;
        const now = Date.now();
        let notifyTime = new Date(time - beforeTime);
        if (time - now >= beforeTime) {
            before = Math.floor(((time - now) / 1000) * 60);
        }
        console.log(`Set up checkout reminder #${bookingRef}: ${notifyTime}`);
        ScheduleService.agenda.define(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`, async (job) => {
            console.log(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`);
            try {
                const data = job.attrs.data;
                _1.Firebase.remindCheckOutClient(data.user.firebaseToken, data.bookingRef, data.before);
                _1.Firebase.remindCheckOutHost(data.host.firebaseToken, data.user.fullname, data.bookingRef, data.before);
            }
            catch (err) {
                console.log(err);
            }
        });
        ScheduleService.agenda.schedule(notifyTime, `${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`, { bookingRef, endTime, before, user, host });
    }
    static async verifyCheckOut(id, endTime, bookingRef, bookingRepository) {
        const checkTime = new Date(endTime.getTime() + 1000 * 60 * 10);
        console.log(`Set verify checkout time #${bookingRef}: ${checkTime}`);
        ScheduleService.agenda.define(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`, async (job) => {
            console.log(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`);
            try {
                const data = job.attrs.data;
                const booking = await bookingRepository.findById(data.id, {
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
                if (booking.status === constants_1.BookingConstant.FINISH &&
                    booking.transaction.checkOut) {
                    console.log('valid check out');
                    return;
                }
                booking.status = constants_1.BookingConstant.FAIL;
                _1.Firebase.notifyClientCheckOutOverTime(booking.user.firebaseToken, booking.transaction.bookingRefernce);
                _1.Firebase.notifyHostCheckOutOverTime(booking.room.coWorking.user.firebaseToken, booking.transaction.bookingRefernce);
                delete booking.transaction;
                delete booking.room;
                delete booking.user;
                await bookingRepository.update(booking);
            }
            catch (error) {
                console.log(error);
            }
        });
        ScheduleService.agenda.schedule(checkTime, `${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`, { id, endTime });
    }
}
exports.ScheduleService = ScheduleService;
ScheduleService.verifyCheckIn = async (id, startTime, bookingRef, bookingRepository) => {
    const checkTime = new Date(startTime.getTime() + 1000 * 60 * 10);
    console.log(`Set verify checkin time #${bookingRef}: ${checkTime}`);
    ScheduleService.agenda.define(`${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`, async (job) => {
        console.log(`${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`);
        try {
            const data = job.attrs.data;
            const booking = await bookingRepository.findById(data.id, {
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
            if (booking.status === constants_1.BookingConstant.ON_GOING ||
                booking.transaction.checkIn) {
                console.log('valid check in');
                return;
            }
            booking.status = constants_1.BookingConstant.CANCELED;
            _1.Firebase.notifyClientCheckInOverTime(booking.user.firebaseToken, booking.transaction.bookingRefernce);
            _1.Firebase.notifyHostCheckInOverTime(booking.room.coWorking.user.firebaseToken, booking.transaction.bookingRefernce);
            // Cancel verify check out of this booking
            ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`);
            ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`);
            delete booking.transaction;
            delete booking.room;
            delete booking.user;
            await bookingRepository.update(booking);
        }
        catch (error) {
            console.log(error);
        }
    });
    ScheduleService.agenda.schedule(checkTime, `${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`, { id, startTime });
};
//# sourceMappingURL=schedule.service.js.map