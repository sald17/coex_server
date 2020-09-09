import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
    CountSchema,
    FilterExcludingWhere,
    repository,
} from '@loopback/repository';
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
                include: [{relation: 'coWorking'}],
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

        return newBooking;
    }

    // Get booking history
    @authorize({
        allowedRoles: ['client'],
        voters: [basicAuthorization],
    })
    @get('/bookings/history', {
        responses: {
            '200': {
                description: 'Booking model count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async getHistory() {
        return this.bookingRepository.find({
            where: {userId: this.user[securityId]},
            include: [{relation: 'transaction'}],
        });
    }

    // Get booking, add query params date=YYYY-MM-DD to find booking by date
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
    async find(@param.query.string('date') date: string): Promise<Booking[]> {
        if (date) {
            return this.bookingRepository.findBookingByDate(date);
        }
        return this.bookingRepository.find();
    }

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
    async findById(
        @param.path.string('id') id: string,
        @param.filter(Booking, {exclude: 'where'})
        filter?: FilterExcludingWhere<Booking>,
    ): Promise<Booking> {
        return this.bookingRepository.findById(id, filter);
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
        const booking: any = await this.bookingRepository.findById(id, {
            include: [
                {relation: 'room', scope: {include: [{relation: 'coWorking'}]}},
                {relation: 'transaction'},
            ],
        });
        if (this.user[securityId].localeCompare(booking.userId)) {
            throw new HttpErrors.Unauthorized();
        }

        if (
            booking.status === BookingConstant.FINISH ||
            booking.status === BookingConstant.CANCELED ||
            booking.transaction.payment ||
            booking.transaction.checkIn ||
            booking.transaction.checkOut
        ) {
            throw new HttpErrors.BadRequest('Cannot update this booking');
        }
        const room = await this.roomRepository.findById(booking.roomId);
        let validated = await this.bookingRepository.validateBooking(
            updatedBooking,
            room,
        );

        const timestamp = Date();
        await this.transactionRepository.updateById(booking.transaction.id, {
            modifiedAt: timestamp,
            price: this.bookingRepository.getBookingPrice(updatedBooking, room),
        });

        validated.modifiedAt = timestamp;
        let r = await this.bookingRepository.updateById(id, validated);

        /**
         * Add noti here
         */
        return r;
    }

    //Cancel booking
    @patch('/bookings/cancel/{id}')
    async cancelBooking(@param.path.string('id') id: string) {
        const booking: any = await this.bookingRepository.findById(id, {
            include: [
                {relation: 'room', scope: {include: [{relation: 'coWorking'}]}},
                {relation: 'transaction'},
            ],
        });
        if (this.user[securityId].localeCompare(booking.userId)) {
            throw new HttpErrors.Unauthorized();
        }
        if (
            booking.status === BookingConstant.FINISH ||
            booking.status === BookingConstant.CANCELED ||
            booking.status === BookingConstant.ON_GOING ||
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
        delete booking.room;
        delete booking.transaction;
        await this.bookingRepository.update(booking);
    }

    //Check in
    @patch('/bookings/checkin/{id}')
    async checkIn(@param.path.string('id') id: string) {
        const booking: any = await this.bookingRepository.findById(id, {
            include: [
                {relation: 'room', scope: {include: [{relation: 'coWorking'}]}},
                {relation: 'transaction'},
            ],
        });
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
        await this.transactionRepository.updateById(booking.transaction.id, {
            checkInTime: timestamp,
            checkIn: true,
            modifiedAt: timestamp,
        });

        booking.status = BookingConstant.ON_GOING;
        delete booking.room;
        delete booking.transaction;

        await this.bookingRepository.update(booking);
    }

    //Checkout

    @patch('/bookings/checkout/{id}')
    async checkOut(@param.path.string('id') id: string) {
        const booking: any = await this.bookingRepository.findById(id, {
            include: [
                {relation: 'room', scope: {include: [{relation: 'coWorking'}]}},
                {relation: 'transaction'},
            ],
        });
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

        const user: any = await this.userRepository.findById(
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
    }
}