"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCheckIn = exports.checkInNotification = void 0;
const _1 = require(".");
exports.checkInNotification = async (job) => {
    try {
        const data = job.attrs.data;
        _1.Firebase.remindCheckInClient(data.user.firebaseToken, data.bookingRef, data.before);
        _1.Firebase.remindCheckInHost(data.host.firebaseToken, data.user.fullname, data.bookingRef, data.before);
    }
    catch (err) {
        console.log(err);
    }
};
exports.verifyCheckIn = async (job) => {
    try {
        const data = job.attrs.data;
        console.log('=======');
        const booking = await this.bookingRepository.findById('5f59050d393bb3e7a95760e0', {
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
                                    include: [{ relation: 'user' }],
                                },
                            },
                        ],
                    },
                },
            ],
        });
        if (booking.status !== BookingConstant.ON_GOING ||
            !booking.transaction.checkIn) {
            booking.status = BookingConstant.CANCELED;
            await _1.Firebase.notifyClientCheckInOverTime(booking.user.firebaseToken, booking.transaction.bookingReference);
            await _1.Firebase.notifyHostCheckInOverTime(booking.room.coWorking.user.firebaseToken, booking.transaction.bookingReference);
        }
        delete booking.transaction;
        delete booking.room;
        delete booking.user;
        const r = await this.bookingRepository.update(booking);
    }
    catch (error) { }
};
//# sourceMappingURL=schedule.handler.js.map