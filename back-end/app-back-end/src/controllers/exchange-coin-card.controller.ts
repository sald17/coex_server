import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ExchangeCoin,
  Card,
} from '../models';
import {ExchangeCoinRepository} from '../repositories';

export class ExchangeCoinCardController {
  constructor(
    @repository(ExchangeCoinRepository)
    public exchangeCoinRepository: ExchangeCoinRepository,
  ) { }

  @get('/exchange-coins/{id}/card', {
    responses: {
      '200': {
        description: 'Card belonging to ExchangeCoin',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Card)},
          },
        },
      },
    },
  })
  async getCard(
    @param.path.string('id') id: typeof ExchangeCoin.prototype.id,
  ): Promise<Card> {
    return this.exchangeCoinRepository.card(id);
  }
}
