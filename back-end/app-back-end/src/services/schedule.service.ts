import {Firebase} from '.';
import {BookingConstant, ScheduleConstant} from '../config/constants';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {BookingRepository} from '../repositories/booking.repository';
import {TransactionRepository} from '../repositories/transaction.repository';

export class ScheduleService {
    public static agenda: any;

    constructor(
        private userRepository: UserRepository,
        private bookingRepository: BookingRepository,
        private transactionRepository: TransactionRepository,
    ) {}

    static async cancelSchedule(name: string) {
        ScheduleService.agenda.cancel({name});
    }

    static async notifyCheckIn(
        bookingRef: string,
        startTime: Date,
        user: User,
        host: User,
        before: number = 15, // mins
    ) {
        const time = startTime.getTime();
        const beforeTime = 1000 * 60 * before;
        const now = Date.now();
        let notifyTime = new Date(time - beforeTime);
        if (time - now <= beforeTime) {
            before = Math.floor((time - now) / (1000 * 60));
        }
        console.log(`Set up checkin reminder #${bookingRef}: ${notifyTime}`);

        ScheduleService.agenda.define(
            `${ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`,
            async (job: any) => {
                console.log(
                    `${ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`,
                );
                try {
                    const data = job.attrs.data;
                    Firebase.remindCheckInClient(
                        data.user.firebaseToken,
                        data.bookingRef,
                        data.before,
                    );

                    Firebase.remindCheckInHost(
                        data.host.firebaseToken,
                        data.user.fullname,
                        data.bookingRef,
                        data.before,
                    );
                } catch (err) {
                    console.log(err);
                }
            },
        );

        ScheduleService.agenda.schedule(
            notifyTime,
            `${ScheduleConstant.CHECK_IN_NOTIFICATION}:${bookingRef}`,
            {bookingRef, startTime, before, user, host},
        );
    }

    static async notifyCheckOut(
        bookingRef: string,
        endTime: Date,
        user: User,
        host: User,
        before: number = 15, //mins
    ) {
        const time = endTime.getTime();
        const beforeTime = 1000 * 60 * before;
        const now = Date.now();
        let notifyTime = new Date(time - beforeTime);
        if (time - now >= beforeTime) {
            before = Math.floor(((time - now) / 1000) * 60);
        }
        console.log(`Set up checkout reminder #${bookingRef}: ${notifyTime}`);
        ScheduleService.agenda.define(
            `${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`,
            async (job: any) => {
                console.log(
                    `${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`,
                );
                try {
                    const data = job.attrs.data;
                    Firebase.remindCheckOutClient(
                        data.user.firebaseToken,
                        data.bookingRef,
                        data.before,
                    );

                    Firebase.remindCheckOutHost(
                        data.host.firebaseToken,
                        data.user.fullname,
                        data.bookingRef,
                        data.before,
                    );
                } catch (err) {
                    console.log(err);
                }
            },
        );

        ScheduleService.agenda.schedule(
            notifyTime,
            `${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`,
            {bookingRef, endTime, before, user, host},
        );
    }

    static verifyCheckIn = async (
        id: any,
        startTime: Date,
        bookingRef: string,
        bookingRepository: BookingRepository,
    ) => {
        const checkTime = new Date(startTime.getTime() + 1000 * 60 * 10);
        console.log(`Set verify checkin time #${bookingRef}: ${checkTime}`);
        ScheduleService.agenda.define(
            `${ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`,
            async (job: any) => {
                console.log(
                    `${ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`,
                );
                try {
                    const data = job.attrs.data;
                    const booking: any = await bookingRepository.findById(
                        data.id,
                        {
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
                                                        {relation: 'user'},
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    );

                    if (
                        booking.status === BookingConstant.ON_GOING ||
                        booking.transaction.checkIn
                    ) {
                        console.log('valid check in');
                        return;
                    }
                    booking.status = BookingConstant.CANCELED;
                    Firebase.notifyClientCheckInOverTime(
                        booking.user.firebaseToken,
                        booking.transaction.bookingRefernce,
                    );
                    Firebase.notifyHostCheckInOverTime(
                        booking.room.coWorking.user.firebaseToken,
                        booking.transaction.bookingRefernce,
                    );

                    // Cancel verify check out of this booking
                    ScheduleService.cancelSchedule(
                        `${ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`,
                    );
                    ScheduleService.cancelSchedule(
                        `${ScheduleConstant.CHECK_OUT_NOTIFICATION}:${bookingRef}`,
                    );

                    delete booking.transaction;
                    delete booking.room;
                    delete booking.user;

                    await bookingRepository.update(booking);
                } catch (error) {
                    console.log(error);
                }
            },
        );

        ScheduleService.agenda.schedule(
            checkTime,
            `${ScheduleConstant.VERIFY_CHECK_IN}:${bookingRef}`,
            {id, startTime},
        );
    };

    static async verifyCheckOut(
        id: any,
        endTime: Date,
        bookingRef: string,
        bookingRepository: BookingRepository,
    ) {
        const checkTime = new Date(endTime.getTime() + 1000 * 60 * 10);
        console.log(`Set verify checkout time #${bookingRef}: ${checkTime}`);
        ScheduleService.agenda.define(
            `${ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`,
            async (job: any) => {
                console.log(
                    `${ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`,
                );
                try {
                    const data = job.attrs.data;
                    const booking: any = await bookingRepository.findById(
                        data.id,
                        {
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
                                                        {relation: 'user'},
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    );
                    if (
                        booking.status === BookingConstant.FINISH &&
                        booking.transaction.checkOut
                    ) {
                        console.log('valid check out');
                        return;
                    }
                    booking.status = BookingConstant.FAIL;
                    Firebase.notifyClientCheckOutOverTime(
                        booking.user.firebaseToken,
                        booking.transaction.bookingRefernce,
                    );
                    Firebase.notifyHostCheckOutOverTime(
                        booking.room.coWorking.user.firebaseToken,
                        booking.transaction.bookingRefernce,
                    );
                    delete booking.transaction;
                    delete booking.room;
                    delete booking.user;

                    await bookingRepository.update(booking);
                } catch (error) {
                    console.log(error);
                }
            },
        );
        ScheduleService.agenda.schedule(
            checkTime,
            `${ScheduleConstant.VERIFY_CHECK_OUT}:${bookingRef}`,
            {id, endTime},
        );
    }
}
