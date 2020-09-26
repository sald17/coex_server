import {Getter, inject} from '@loopback/core';
import {
    BelongsToAccessor,
    DefaultCrudRepository,
    HasOneRepositoryFactory,
    repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {BookingConstant, filterTimeBooking} from '../config/constants';
import {MongoConnectorDataSource} from '../datasources';
import {Booking, BookingRelations, Room, Transaction, User} from '../models';
import {stringToDate} from '../services/date-utils';
import {RoomRepository} from './room.repository';
import {TransactionRepository} from './transaction.repository';
import {UserRepository} from './user.repository';

export class BookingRepository extends DefaultCrudRepository<
    Booking,
    typeof Booking.prototype.id,
    BookingRelations
> {
    public readonly user: BelongsToAccessor<User, typeof Booking.prototype.id>;

    public readonly room: BelongsToAccessor<Room, typeof Booking.prototype.id>;

    public readonly transaction: HasOneRepositoryFactory<
        Transaction,
        typeof Booking.prototype.id
    >;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('UserRepository')
        protected userRepositoryGetter: Getter<UserRepository>,
        @repository.getter('RoomRepository')
        protected roomRepositoryGetter: Getter<RoomRepository>,
        @repository.getter('TransactionRepository')
        protected transactionRepositoryGetter: Getter<TransactionRepository>,
    ) {
        super(Booking, dataSource);
        this.transaction = this.createHasOneRepositoryFactoryFor(
            'transaction',
            transactionRepositoryGetter,
        );
        this.registerInclusionResolver(
            'transaction',
            this.transaction.inclusionResolver,
        );
        this.room = this.createBelongsToAccessorFor(
            'room',
            roomRepositoryGetter,
        );
        this.registerInclusionResolver('room', this.room.inclusionResolver);
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter,
        );
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }

    /**
     * Check if sent booking is valid and return a standard model to add to db
     * @param userId
     * @param bookingInfo
     * @param userRepository
     * @param roomRepository
     */

    async validateBooking(bookingInfo: any, room: Room) {
        bookingInfo.startTime = stringToDate(bookingInfo.startTime);
        bookingInfo.endTime = new Date(
            bookingInfo.startTime.getTime() +
                bookingInfo.duration * 3600 * 1000,
        );
        // check time
        if (
            bookingInfo.startTime < Date.now() ||
            bookingInfo.startTime > bookingInfo.endTime
        ) {
            throw new HttpErrors.BadRequest('Invalid timestamps');
        }

        // check room's capacity
        const timeFilter = filterTimeBooking(
            bookingInfo.startTime,
            bookingInfo.endTime,
        );

        const listBookingInTime = await this.find({
            where: timeFilter,
        });
        // console.log(bookingInfo.startTime);
        // console.log(bookingInfo.endTime);
        // console.log(listBookingInTime.length);

        if (listBookingInTime && listBookingInTime.length !== 0) {
            // Kiểm tra nếu như có người đã đặt phòng trong khoảng thời gian muốn.
            for (let booking of listBookingInTime) {
                if (
                    booking.status === BookingConstant.FINISH ||
                    booking.status === BookingConstant.CANCELED
                )
                    continue;
                if (
                    booking.numPerson + bookingInfo.numPerson >
                    room.maxPerson
                ) {
                    throw new HttpErrors.BadRequest('Not enough capacity.');
                }
            }
        } else {
            // Nếu phòng trống, ktra số lượng người cho phép thuê
            if (bookingInfo.numPerson > room.maxPerson) {
                throw new HttpErrors.BadRequest('Not enough capacity.');
            }
        }
        // console.log(new Date(bookingInfo.startTime.toISOString()));
        return Object.assign({}, bookingInfo, {});
    }

    /**
     * Find booking by date
     */

    async findBookingByDate(date: string, {user, room}: any) {
        date = date.concat('-0-0');
        const startDate = stringToDate(date, false);
        const endDate = new Date(startDate.getTime() + 1000 * 3600 * 24);
        const whereCond: any = {
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
        } else if (room) {
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
                            {relation: 'coWorking'},
                            {relation: 'service'},
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
    getBookingPrice(bookingInfo: any, room: Room) {
        return bookingInfo.numPerson * bookingInfo.duration * room.price;
    }
}
