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
  Card,
  ExchangeCoin,
} from '../models';
import {CardRepository} from '../repositories';

export class CardExchangeCoinController {
  constructor(
    @repository(CardRepository) protected cardRepository: CardRepository,
  ) { }

  @get('/cards/{id}/exchange-coins', {
    responses: {
      '200': {
        description: 'Array of Card has many ExchangeCoin',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ExchangeCoin)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ExchangeCoin>,
  ): Promise<ExchangeCoin[]> {
    return this.cardRepository.exchangeCoins(id).find(filter);
  }

  @post('/cards/{id}/exchange-coins', {
    responses: {
      '200': {
        description: 'Card model instance',
        content: {'application/json': {schema: getModelSchemaRef(ExchangeCoin)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Card.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ExchangeCoin, {
            title: 'NewExchangeCoinInCard',
            exclude: ['id'],
            optional: ['cardId']
          }),
        },
      },
    }) exchangeCoin: Omit<ExchangeCoin, 'id'>,
  ): Promise<ExchangeCoin> {
    return this.cardRepository.exchangeCoins(id).create(exchangeCoin);
  }

  @patch('/cards/{id}/exchange-coins', {
    responses: {
      '200': {
        description: 'Card.ExchangeCoin PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ExchangeCoin, {partial: true}),
        },
      },
    })
    exchangeCoin: Partial<ExchangeCoin>,
    @param.query.object('where', getWhereSchemaFor(ExchangeCoin)) where?: Where<ExchangeCoin>,
  ): Promise<Count> {
    return this.cardRepository.exchangeCoins(id).patch(exchangeCoin, where);
  }

  @del('/cards/{id}/exchange-coins', {
    responses: {
      '200': {
        description: 'Card.ExchangeCoin DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ExchangeCoin)) where?: Where<ExchangeCoin>,
  ): Promise<Count> {
    return this.cardRepository.exchangeCoins(id).delete(where);
  }
}
