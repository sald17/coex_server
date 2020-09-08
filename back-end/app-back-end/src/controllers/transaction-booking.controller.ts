import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Booking, Transaction} from '../models';
import {TransactionRepository} from '../repositories';

export class TransactionBookingController {
    constructor(
        @repository(TransactionRepository)
        public transactionRepository: TransactionRepository,
    ) {}

    @get('/transactions/{id}/booking', {
        responses: {
            '200': {
                description: 'Booking belonging to Transaction',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(Booking),
                        },
                    },
                },
            },
        },
    })
    async getBooking(
        @param.path.string('id') id: typeof Transaction.prototype.id,
    ): Promise<Booking> {
        return this.transactionRepository.booking(id);
    }
}
