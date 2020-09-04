import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Service,
  Room,
} from '../models';
import {ServiceRepository} from '../repositories';

export class ServiceRoomController {
  constructor(
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
  ) { }

  @get('/services/{id}/room', {
    responses: {
      '200': {
        description: 'Room belonging to Service',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Room)},
          },
        },
      },
    },
  })
  async getRoom(
    @param.path.string('id') id: typeof Service.prototype.id,
  ): Promise<Room> {
    return this.serviceRepository.room(id);
  }
}
