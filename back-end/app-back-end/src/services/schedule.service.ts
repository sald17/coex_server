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

    public async define() {
        // Remind check in
        ScheduleService.agenda.define(
            ScheduleConstant.CHECK_IN_NOTIFICATION,
            async (job: any) => {
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

        // Remind check out
        ScheduleService.agenda.define(
            ScheduleConstant.CHECK_OUT_NOTIFICATION,
            async (job: any) => {
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

        // Verify check in, if late 10 min then cancel booking
        ScheduleService.agenda.define(
            ScheduleConstant.VERIFY_CHECK_IN,
            async (job: any) => {
                try {
                    const data = job.attrs.data;
                    const booking: any = await this.bookingRepository.findById(
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
                        booking.status !== BookingConstant.ON_GOING ||
                        !booking.transaction.checkIn
                    ) {
                        booking.status = BookingConstant.CANCELED;
                        Firebase.notifyClientCheckInOverTime(
                            booking.user.firebaseToken,
                            booking.transaction.bookingRefernce,
                        );
                        Firebase.notifyHostCheckInOverTime(
                            booking.room.coWorking.user.firebaseToken,
                            booking.transaction.bookingRefernce,
                        );
                    }

                    delete booking.transaction;
                    delete booking.room;
                    delete booking.user;

                    const r = await this.bookingRepository.update(booking);
                } catch (error) {
                    console.log(error);
                }
            },
        );

        // Verify check out, if late 5 min then cancel booking

        ScheduleService.agenda.define(
            ScheduleConstant.VERIFY_CHECK_OUT,
            async (job: any) => {
                try {
                    const data = job.attrs.data;
                    const booking: any = await this.bookingRepository.findById(
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
                        booking.status !== BookingConstant.FINISH ||
                        !booking.transaction.checkOut
                    ) {
                        booking.status = BookingConstant.FAIL;
                        Firebase.notifyClientCheckInOverTime(
                            booking.user.firebaseToken,
                            booking.transaction.bookingRefernce,
                        );
                        Firebase.notifyHostCheckInOverTime(
                            booking.room.coWorking.user.firebaseToken,
                            booking.transaction.bookingRefernce,
                        );
                    }

                    delete booking.transaction;
                    delete booking.room;
                    delete booking.user;

                    const r = await this.bookingRepository.update(booking);
                } catch (error) {
                    console.log(error);
                }
            },
        );
    }

    static async notifyCheckIn(
        bookingRef: string,
        startTime: Date,
        user: User,
        host: User,
        before: number = 15,
    ) {
        const notifyTime = new Date(startTime.getTime() - 1000 * 60 * before);
        ScheduleService.agenda.schedule(
            notifyTime,
            ScheduleConstant.CHECK_IN_NOTIFICATION,
            {bookingRef, startTime, before, user, host},
        );
    }

    static async notifyCheckOut(
        bookingRef: string,
        endTime: Date,
        user: User,
        host: User,
        before: number = 15,
    ) {
        const notifyTime = new Date(endTime.getTime() - 1000 * 60 * before);
        ScheduleService.agenda.schedule(
            notifyTime,
            ScheduleConstant.CHECK_OUT_NOTIFICATION,
            {bookingRef, endTime, before, user, host},
        );
    }

    static async verifyCheckIn(id: string, startTime: Date) {
        const checkTime = new Date(startTime.getTime() + 1000 * 69 * 10);
        ScheduleService.agenda.schedule(
            checkTime,
            ScheduleConstant.VERIFY_CHECK_IN,
            {id, startTime},
        );
    }

    static async verifyCheckOut(id: string, endTime: Date) {
        const checkTime = new Date(endTime.getTime() + 1000 * 60 * 5);
        ScheduleService.agenda.schedule(
            checkTime,
            ScheduleConstant.VERIFY_CHECK_OUT,
            {id, endTime},
        );
    }
}
