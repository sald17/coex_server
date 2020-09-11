import {Firebase, ScheduleService} from '.';
import {ScheduleConstant} from '../config/constants';
import {Booking, Room, Transaction, User} from '../models';
import {BookingRepository} from '../repositories';

export class NotificationService {
    static async notifyAfterCreate(
        newTransaction: Transaction,
        newBooking: Booking,
        room: any,
        user: User,
        host: User,
        bookingRepository: BookingRepository,
    ) {
        ScheduleService.notifyCheckIn(
            newTransaction.bookingRefernce,
            newBooking.startTime,
            user,
            host,
        );

        ScheduleService.notifyCheckOut(
            newTransaction.bookingRefernce,
            newBooking.endTime,
            user,
            host,
        );

        // Cancel booking if user not check in late 10 mins
        ScheduleService.verifyCheckIn(
            newBooking.id,
            newBooking.startTime,
            newTransaction.bookingRefernce,
            bookingRepository,
        );
        ScheduleService.verifyCheckOut(
            newBooking.id,
            newBooking.endTime,
            newTransaction.bookingRefernce,
            bookingRepository,
        );

        // Notify host
        Firebase.notifyHostNewBooking(
            room.coWorking.user.firebaseToken,
            room.name,
            newTransaction.bookingRefernce,
        );
    }

    static async notifyAfterUpdate(
        newTransaction: Transaction,
        newBooking: Booking,
        room: any,
        user: User,
        host: User,
        bookingRepository: BookingRepository,
    ) {
        ScheduleService.cancelSchedule(
            `${ScheduleConstant.CHECK_IN_NOTIFICATION}:${newTransaction.bookingRefernce}`,
        );
        ScheduleService.cancelSchedule(
            `${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${newTransaction.bookingRefernce}`,
        );
        ScheduleService.cancelSchedule(
            `${ScheduleConstant.VERIFY_CHECK_IN}:${newTransaction.bookingRefernce}`,
        );
        ScheduleService.cancelSchedule(
            `${ScheduleConstant.VERIFY_CHECK_OUT}:${newTransaction.bookingRefernce}`,
        );

        ScheduleService.notifyCheckIn(
            newTransaction.bookingRefernce,
            newBooking.startTime,
            user,
            host,
        );

        ScheduleService.notifyCheckOut(
            newTransaction.bookingRefernce,
            newBooking.startTime,
            user,
            host,
        );

        // Notify host
        Firebase.notifyHostUpdatedBooking(
            room.coWorking.user.firebaseToken,
            newTransaction.bookingRefernce,
        );

        // Cancel booking if user not check in late 10 mins
        ScheduleService.verifyCheckIn(
            newBooking.id,
            newBooking.startTime,
            newTransaction.bookingRefernce,
            bookingRepository,
        );
        ScheduleService.verifyCheckOut(
            newBooking.id,
            newBooking.endTime,
            newTransaction.bookingRefernce,
            bookingRepository,
        );
    }

    static async notifyAfterCancel(newTransaction: Transaction, host: User) {
        ScheduleService.cancelSchedule(
            `${ScheduleConstant.CHECK_IN_NOTIFICATION}:${newTransaction.bookingRefernce}`,
        );
        ScheduleService.cancelSchedule(
            `${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${newTransaction.bookingRefernce}`,
        );
        ScheduleService.cancelSchedule(
            `${ScheduleConstant.VERIFY_CHECK_IN}:${newTransaction.bookingRefernce}`,
        );
        ScheduleService.cancelSchedule(
            `${ScheduleConstant.VERIFY_CHECK_OUT}:${newTransaction.bookingRefernce}`,
        );

        Firebase.notifyCancelBooking(
            host.firebaseToken,
            newTransaction.bookingRefernce,
        );
    }

    static async notifyAfterCheckout(
        user: User,
        host: User,
        point: number,
        bookingRef: string,
    ) {
        Firebase.notifyPoint(user.firebaseToken, point, bookingRef);
        Firebase.notifyHostCheckOut(
            host.firebaseToken,
            user.fullname,
            bookingRef,
        );
    }

    static async notifyAfterCheckin(
        client: User,
        host: User,
        room: Room,
        bookingRef: string,
    ) {
        Firebase.notifyClientCheckIn(
            client.firebaseToken,
            room.name,
            bookingRef,
        );
        Firebase.notifyHostCheckIn(
            host.firebaseToken,
            client.fullname,
            room.name,
            bookingRef,
        );
    }
}
