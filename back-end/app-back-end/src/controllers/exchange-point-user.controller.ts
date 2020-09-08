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
  User,
} from '../models';
import {ExchangePointRepository} from '../repositories';

export class ExchangePointUserController {
  constructor(
    @repository(ExchangePointRepository)
    public exchangePointRepository: ExchangePointRepository,
  ) { }

  @get('/exchange-points/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to ExchangePoint',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof ExchangePoint.prototype.id,
  ): Promise<User> {
    return this.exchangePointRepository.user(id);
  }
}
