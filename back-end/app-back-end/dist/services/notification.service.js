"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const _1 = require(".");
const constants_1 = require("../config/constants");
class NotificationService {
    static async notifyAfterCreate(newTransaction, newBooking, room, user, host, bookingRepository) {
        _1.ScheduleService.notifyCheckIn(newTransaction.bookingRefernce, newBooking.startTime, user, host);
        _1.ScheduleService.notifyCheckOut(newTransaction.bookingRefernce, newBooking.endTime, user, host);
        // Cancel booking if user not check in late 10 mins
        _1.ScheduleService.verifyCheckIn(newBooking.id, newBooking.startTime, newTransaction.bookingRefernce, bookingRepository);
        _1.ScheduleService.verifyCheckOut(newBooking.id, newBooking.endTime, newTransaction.bookingRefernce, bookingRepository);
        // Notify host
        _1.Firebase.notifyHostNewBooking(room.coWorking.user.firebaseToken, room.name, newTransaction.bookingRefernce);
    }
    static async notifyAfterUpdate(newTransaction, newBooking, room, user, host, bookingRepository) {
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.notifyCheckIn(newTransaction.bookingRefernce, newBooking.startTime, user, host);
        _1.ScheduleService.notifyCheckOut(newTransaction.bookingRefernce, newBooking.startTime, user, host);
        // Notify host
        _1.Firebase.notifyHostUpdatedBooking(room.coWorking.user.firebaseToken, newTransaction.bookingRefernce);
        // Cancel booking if user not check in late 10 mins
        _1.ScheduleService.verifyCheckIn(newBooking.id, newBooking.startTime, newTransaction.bookingRefernce, bookingRepository);
        _1.ScheduleService.verifyCheckOut(newBooking.id, newBooking.endTime, newTransaction.bookingRefernce, bookingRepository);
    }
    static async notifyAfterCancel(newTransaction, host) {
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_IN_NOTIFICATION}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.CHECK_OUT_NOTIFICATION}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_IN}:${newTransaction.bookingRefernce}`);
        _1.ScheduleService.cancelSchedule(`${constants_1.ScheduleConstant.VERIFY_CHECK_OUT}:${newTransaction.bookingRefernce}`);
        _1.Firebase.notifyCancelBooking(host.firebaseToken, newTransaction.bookingRefernce);
    }
    static async notifyAfterCheckout(user, host, point, bookingRef) {
        _1.Firebase.notifyPoint(user.firebaseToken, point, bookingRef);
        _1.Firebase.notifyHostCheckOut(host.firebaseToken, user.fullname, bookingRef);
    }
    static async notifyAfterCheckin(client, host, room, bookingRef) {
        _1.Firebase.notifyClientCheckIn(client.firebaseToken, room.name, bookingRef);
        _1.Firebase.notifyHostCheckIn(host.firebaseToken, client.fullname, room.name, bookingRef);
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map