import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
    get,
    getModelSchemaRef,
    HttpErrors,
    param,
    patch,
    post,
    requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {basicAuthorization} from '../access-control/authenticator/basic-authentication';
import {BookingConstant, PointConstant} from '../config/constants';
import {Booking, Transaction} from '../models';
import {
    BookingRepository,
    ExchangePointRepository,
    RoomRepository,
    TransactionRepository,
    UserRepository,
} from '../repositories';
import {NotificationService} from '../services';

// Check in cho phep tre 10 phut
// Check out cho phep tre 5 phut

@authenticate('jwt')
export class BookingController {
    constructor(
        @repository(BookingRepository)
        public bookingRepository: BookingRepository,
        @repository(UserRepository)
        public userRepository: UserRepository,
        @repository(RoomRepository)
        public roomRepository: RoomRepository,
        @repository(TransactionRepository)
        public transactionRepository: TransactionRepository,
        @repository(ExchangePointRepository)
        public pointRepository: ExchangePointRepository,

        @inject(SecurityBindings.USER)
        public user: UserProfile,
    ) {}

    // Get price of booking

    @authorize({
        allowedRoles: ['client'],
        voters: [basicAuthorization],
    })
    @post('/bookings/price', {
        responses: {
            '200': {
                description: 'Booking model instance',
            },
        },
    })
    async getPrice(
        @requestBody()
        bookingInfo: any,
    ) {
        //Check user and room
        const user = await this.userRepository.findById(this.user[securityId]);
        const room: any = await this.roomRepository.findById(
            bookingInfo.roomId,
            {
                include: [{relation: 'coWorking'}],
            },
        );
        if (!user || !room) {
            throw new HttpErrors.NotFound('Not Found User or Room');
        }

        // Validate booking
        const result = await this.bookingRepository.validateBooking(
            bookingInfo,
            room,
        );

        return {price: this.bookingRepository.getBookingPrice(result, room)};
    }

    // Create Booking
    @authorize({
        allowedRoles: ['client'],
        voters: [basicAuthorization],
    })
    @post('/bookings', {
        responses: {
            '200': {
                description: 'Booking model instance',
            },
        },
    })
    async create(
        @requestBody()
        bookingInfo: any,
    ) {
        //Check user and room
        const user = await this.userRepository.findById(this.user[securityId]);
        const room: any = await this.roomRepository.findById(
            bookingInfo.roomId,
            {
                include: [
                    {
                        relation: 'coWorking',
                        scope: {include: [{relation: 'user'}]},
                    },
                ],
            },
        );
        if (!this.user[securityId].localeCompare(room.coWorking.userId)) {
            throw new HttpErrors.Unauthorized('Cannot book your own room.');
        }
        if (!user || !room) {
            throw new HttpErrors.NotFound('Not Found User or Room');
        }

        // Validate booking
        const result = await this.bookingRepository.validateBooking(
            bookingInfo,
            room,
        );
        result.userId = this.user[securityId];

        const booking = new Booking(result);
        const newBooking = await this.bookingRepository.create(booking);

        const newTransaction = await this.bookingRepository
            .transaction(newBooking.id)
            .create(
                new Transaction({
                    price: this.bookingRepository.getBookingPrice(
                        bookingInfo,
                        room,
                    ),
                    bookingRefernce: await this.transactionRepository.getBookingReference(),
                }),
            );
        newBooking.transaction = newTransaction;

        /**
         * Send Noti here
         */

        const host = room.coWorking.user;

        NotificationService.notifyAfterCreate(
            newTransaction,
            newBooking,
            room,
            user,
            host,
            this.bookingRepository,
        );
        return newBooking;
    }

    // Get booking, add query params date=YYYY-MM-DD to find booking by date
    @authorize({
        allowedRoles: ['client', 'host'],
        voters: [basicAuthorization],
    })
    @get('/bookings', {
        responses: {
            '200': {
                description: 'Array of Booking model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(Booking, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    })
    async find(
        @param.query.string('date') date: string,
        @param.query.string('room') roomId: string,
    ): Promise<Booking[]> {
        let userId = '';
        let whereCond: any = {};
        if (this.user.profile.role.includes('client')) {
            userId = this.user[securityId];
            whereCond.userId = userId;
        }
        if (roomId) {
            whereCond.roomId = roomId;
        }
        if (date) {
            return this.bookingRepository.findBookingByDate(date, {
                user: userId,
                room: roomId,
            });
        }
        return this.bookingRepository.find({
            where: whereCond,
            include: [
                {relation: 'transaction'},
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

    @authorize({
        allowedRoles: ['client', 'host'],
        voters: [basicAuthorization],
    })
    @get('/bookings/{id}', {
        responses: {
            '200': {
                description: 'Booking model instance',
                content: {
                    'application/json': {
                        schema: getModelSchemaRef(Booking, {
                            includeRelations: true,
                        }),
                    },
                },
            },
        },
    })
    async findById(@param.path.string('id') id: string): Promise<Booking> {
        return this.bookingRepository.findById(id, {
            include: [
                {
                    relation: 'room',
                    scope: {
                        include: [{relation: 'coWorking'}],
                    },
                },
                {
                    relation: 'user',
                    scope: {
                        fields: {
                            password: false,
                            firebaseToken: false,
                            token: false,
                            emailVerified: false,
                        },
                    },
                },
                {relation: 'transaction'},
            ],
        });
    }

    @authorize({
        allowedRoles: ['client'],
        voters: [basicAuthorization],
    })
    @patch('/bookings/{id}', {
        responses: {
            '204': {
                description: 'Booking PATCH success',
            },
        },
    })
    async updateById(
        @param.path.string('id') id: string,
        @requestBody()
        updatedBooking: any,
    ): Promise<void> {
        let booking: any = await this.bookingRepository.findById(id, {
            include: [
                {
                    relation: 'room',
                    scope: {
                        include: [
                            {
                                relation: 'coWorking',
                                scope: {include: [{relation: 'user'}]},
                            },
                        ],
                    },
                },
                {relation: 'transaction'},
            ],
        });
        if (this.user[securityId].localeCompare(booking.userId)) {
            throw new HttpErrors.Unauthorized();
        }

        if (
            booking.status !== BookingConstant.PENDING ||
            booking.transaction.payment ||
            booking.transaction.checkIn ||
            booking.transaction.checkOut
        ) {
            throw new HttpErrors.BadRequest('Cannot update this booking');
        }
        const room = await this.roomRepository.findById(booking.roomId, {
            include: [
                {relation: 'coWorking', scope: {include: [{relation: 'user'}]}},
            ],
        });
        let validated = await this.bookingRepository.validateBooking(
            updatedBooking,
            room,
        );

        const timestamp = new Date();
        const transaction = await this.transactionRepository.findById(
            booking.transaction.id,
        );
        transaction.modifiedAt = timestamp;
        transaction.price = this.bookingRepository.getBookingPrice(
            updatedBooking,
            room,
        );

        await this.transactionRepository.update(transaction);

        validated.modifiedAt = timestamp;
        booking = Object.assign(booking, validated, {modifiedAt: timestamp});

        const user = await this.userRepository.findById(this.user[securityId]);
        const host = await this.userRepository.findById(
            booking.room.coWorking.userId,
        );

        delete booking.room;
        delete booking.transaction;

        let r = await this.bookingRepository.update(booking);

        /**
         * Add noti here
         */

        NotificationService.notifyAfterUpdate(
            transaction,
            booking,
            room,
            user,
            host,
            this.bookingRepository,
        );
        return r;
    }

    //Cancel booking
    @authorize({
        allowedRoles: ['client'],
        voters: [basicAuthorization],
    })
    @patch('/bookings/cancel/{id}')
    async cancelBooking(@param.path.string('id') id: string) {
        const booking: any = await this.bookingRepository.findById(id, {
            include: [
                {relation: 'room', scope: {include: [{relation: 'coWorking'}]}},
                {relation: 'transaction'},
            ],
        });

        // Kiểm tra người cancel có phải user hay không.
        if (this.user[securityId].localeCompare(booking.userId)) {
            throw new HttpErrors.Unauthorized();
        }
        if (
            booking.status !== BookingConstant.PENDING ||
            booking.transaction.payment ||
            booking.transaction.checkIn ||
            booking.transaction.checkOut
        ) {
            throw new HttpErrors.BadRequest('Cannot cancel this booking');
        }
        if (booking.startTime.getTime() < Date.now()) {
            throw new HttpErrors.BadRequest(
                'Canot cancel. Booking is over due.',
            );
        }
        booking.status = BookingConstant.CANCELED;
        booking.modifiedAt = new Date();

        const transaction = new Transaction(booking.transaction);
        const host = await this.userRepository.findById(
            booking.room.coWorking.userId,
        );
        delete booking.room;
        delete booking.transaction;
        await this.bookingRepository.update(booking);

        NotificationService.notifyAfterCancel(transaction, host);
    }

    //Check in

    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @patch('/bookings/checkin/{id}')
    async checkIn(@param.path.string('id') id: string) {
        const booking: any = await this.bookingRepository.findById(id, {
            include: [
                {relation: 'room', scope: {include: [{relation: 'coWorking'}]}},
                {relation: 'transaction'},
            ],
        });

        // Kiểm tra người checkin có phải host của coWorking hay không.
        if (
            this.user[securityId].localeCompare(booking.room.coWorking.userId)
        ) {
            throw new HttpErrors.Unauthorized();
        }
        // Ktra thoi gian, cho phep tre 10 phut
        if (Date.now() - booking.startTime.getTime() >= 1000 * 60 * 10) {
            throw new HttpErrors.BadRequest('Late for checkin');
        }

        if (
            booking.status !== BookingConstant.PENDING ||
            booking.transaction.payment ||
            booking.transaction.checkIn ||
            booking.transaction.checkOut
        ) {
            throw new HttpErrors.BadRequest(
                `Cannot cancel this booking. Status: ${booking.status}`,
            );
        }

        const timestamp = new Date();
        const bookingRef = booking.transaction.bookingRefernce;
        await this.transactionRepository.updateById(booking.transaction.id, {
            checkInTime: timestamp,
            checkIn: true,
            modifiedAt: timestamp,
        });

        booking.status = BookingConstant.ON_GOING;
        delete booking.room;
        delete booking.transaction;

        await this.bookingRepository.update(booking);

        const host = await this.userRepository.findById(this.user[securityId]);
        const client = await this.userRepository.findById(booking.userId);
        const room = await this.roomRepository.findById(booking.roomId);
        NotificationService.notifyAfterCheckin(client, host, room, bookingRef);
    }

    //Checkout

    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @patch('/bookings/checkout/{id}')
    async checkOut(@param.path.string('id') id: string) {
        const booking: any = await this.bookingRepository.findById(id, {
            include: [
                {relation: 'room', scope: {include: [{relation: 'coWorking'}]}},
                {relation: 'transaction'},
            ],
        });

        // Kiểm tra người checkout có phải host của coWorking hay không.
        if (
            this.user[securityId].localeCompare(booking.room.coWorking.userId)
        ) {
            throw new HttpErrors.Unauthorized();
        }

        // ????????? need re check TH user khong check out
        // Ktra thoi gian, cho phep tre 5 phut
        if (Date.now() - booking.endTime.getTime() >= 1000 * 60 * 5) {
            throw new HttpErrors.BadRequest('Late for check out');
        }

        if (booking.status !== BookingConstant.ON_GOING) {
            throw new HttpErrors.BadRequest(
                `Cannot cancel this booking. Status: ${booking.status}`,
            );
        }

        if (!booking.transaction.checkIn) {
            throw new HttpErrors.BadRequest(`User hasn't checked in.`);
        }
        if (booking.transaction.checkOut) {
            throw new HttpErrors.BadRequest(`User already checked out.`);
        }

        const earnPoint = Math.floor(
            booking.transaction.price / PointConstant.CashToPoint,
        );

        const timestamp = new Date();
        const transactionId = booking.transaction.id;
        const bookingRef = booking.transaction.bookingRefernce;
        // UPdate booking and transaction
        await this.transactionRepository.updateById(booking.transaction.id, {
            checkOutTime: timestamp,
            checkOut: true,
            earnPoint: earnPoint,
            payment: true,
            modifiedAt: timestamp,
        });

        booking.status = BookingConstant.FINISH;
        delete booking.room;
        delete booking.transaction;

        await this.bookingRepository.update(booking);

        // Update user point

        const user: any = await this.userRepository.findById(booking.userId);
        const host: any = await this.userRepository.findById(
            this.user[securityId],
        );
        user.point += earnPoint;
        await this.userRepository.update(user);

        // Update history exchange Point
        await this.pointRepository.create({
            createdAt: timestamp,
            type: PointConstant.EXCHANGE_TYPE.BOOKING,
            point: earnPoint,
            transactionId: transactionId,
            userId: this.user[securityId],
        });

        NotificationService.notifyAfterCheckout(
            user,
            host,
            earnPoint,
            bookingRef,
        );
    }
}
