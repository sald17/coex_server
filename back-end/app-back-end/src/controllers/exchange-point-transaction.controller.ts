import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ExchangePoint,
  Transaction,
} from '../models';
import {ExchangePointRepository} from '../repositories';

export class ExchangePointTransactionController {
  constructor(
    @repository(ExchangePointRepository)
    public exchangePointRepository: ExchangePointRepository,
  ) { }

  @get('/exchange-points/{id}/transaction', {
    responses: {
      '200': {
        description: 'Transaction belonging to ExchangePoint',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Transaction)},
          },
        },
      },
    },
  })
  async getTransaction(
    @param.path.string('id') id: typeof ExchangePoint.prototype.id,
  ): Promise<Transaction> {
    return this.exchangePointRepository.transaction(id);
  }
}
