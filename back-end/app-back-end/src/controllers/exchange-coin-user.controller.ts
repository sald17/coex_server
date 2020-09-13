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
  User,
} from '../models';
import {ExchangeCoinRepository} from '../repositories';

export class ExchangeCoinUserController {
  constructor(
    @repository(ExchangeCoinRepository)
    public exchangeCoinRepository: ExchangeCoinRepository,
  ) { }

  @get('/exchange-coins/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to ExchangeCoin',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof ExchangeCoin.prototype.id,
  ): Promise<User> {
    return this.exchangeCoinRepository.user(id);
  }
}
