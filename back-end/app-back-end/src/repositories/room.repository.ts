import {Getter, inject} from '@loopback/core';
import {
    DefaultCrudRepository,
    HasOneRepositoryFactory,
    repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MongoConnectorDataSource} from '../datasources';
import {Room, RoomRelations, Service, Booking, CoWorking} from '../models';
import {deleteFiles} from '../services/file-upload';
import {ServiceRepository} from './service.repository';
import {BookingRepository} from './booking.repository';
import {CoWorkingRepository} from './co-working.repository';

export class RoomRepository extends DefaultCrudRepository<
    Room,
    typeof Room.prototype.id,
    RoomRelations
> {
    public readonly service: HasOneRepositoryFactory<
        Service,
        typeof Room.prototype.id
    >;

  public readonly bookings: HasManyRepositoryFactory<Booking, typeof Room.prototype.id>;

  public readonly coWorking: BelongsToAccessor<CoWorking, typeof Room.prototype.id>;

    constructor(
        @inject('datasources.MongoConnector')
        dataSource: MongoConnectorDataSource,
        @repository.getter('ServiceRepository')
        protected serviceRepositoryGetter: Getter<ServiceRepository>,
        @repository(ServiceRepository)
        public serviceRepository: ServiceRepository, @repository.getter('BookingRepository') protected bookingRepositoryGetter: Getter<BookingRepository>, @repository.getter('CoWorkingRepository') protected coWorkingRepositoryGetter: Getter<CoWorkingRepository>,
    ) {
        super(Room, dataSource);
      this.coWorking = this.createBelongsToAccessorFor('coWorking', coWorkingRepositoryGetter,);
      this.registerInclusionResolver('coWorking', this.coWorking.inclusionResolver);
      this.bookings = this.createHasManyRepositoryFactoryFor('bookings', bookingRepositoryGetter,);
      this.registerInclusionResolver('bookings', this.bookings.inclusionResolver);
        this.service = this.createHasOneRepositoryFactoryFor(
            'service',
            serviceRepositoryGetter,
        );
        this.registerInclusionResolver(
            'service',
            this.service.inclusionResolver,
        );
    }

    async deleteRoom(id?: string) {
        const room = await this.findById(id, {
            include: [{relation: 'service'}],
        });
        deleteFiles(room.photo);
        await this.serviceRepository.deleteById(room.service.id);
        delete room.service;
        await this.delete(room);
    }
}
