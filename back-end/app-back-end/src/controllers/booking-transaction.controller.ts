import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Booking,
  Transaction,
} from '../models';
import {BookingRepository} from '../repositories';

export class BookingTransactionController {
  constructor(
    @repository(BookingRepository) protected bookingRepository: BookingRepository,
  ) { }

  @get('/bookings/{id}/transaction', {
    responses: {
      '200': {
        description: 'Booking has one Transaction',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Transaction),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Transaction>,
  ): Promise<Transaction> {
    return this.bookingRepository.transaction(id).get(filter);
  }

  @post('/bookings/{id}/transaction', {
    responses: {
      '200': {
        description: 'Booking model instance',
        content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Booking.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransactionInBooking',
            exclude: ['id'],
            optional: ['bookingId']
          }),
        },
      },
    }) transaction: Omit<Transaction, 'id'>,
  ): Promise<Transaction> {
    return this.bookingRepository.transaction(id).create(transaction);
  }

  @patch('/bookings/{id}/transaction', {
    responses: {
      '200': {
        description: 'Booking.Transaction PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {partial: true}),
        },
      },
    })
    transaction: Partial<Transaction>,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.bookingRepository.transaction(id).patch(transaction, where);
  }

  @del('/bookings/{id}/transaction', {
    responses: {
      '200': {
        description: 'Booking.Transaction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.bookingRepository.transaction(id).delete(where);
  }
}
