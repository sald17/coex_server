import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory, HasManyRepositoryFactory, BelongsToAccessor } from '@loopback/repository';
import { MongoConnectorDataSource } from '../datasources';
import { Room, RoomRelations, Service, Booking, CoWorking } from '../models';
import { ServiceRepository } from './service.repository';
import { BookingRepository } from './booking.repository';
import { CoWorkingRepository } from './co-working.repository';
export declare class RoomRepository extends DefaultCrudRepository<Room, typeof Room.prototype.id, RoomRelations> {
    protected serviceRepositoryGetter: Getter<ServiceRepository>;
    serviceRepository: ServiceRepository;
    protected bookingRepositoryGetter: Getter<BookingRepository>;
    protected coWorkingRepositoryGetter: Getter<CoWorkingRepository>;
    readonly service: HasOneRepositoryFactory<Service, typeof Room.prototype.id>;
    readonly bookings: HasManyRepositoryFactory<Booking, typeof Room.prototype.id>;
    readonly coWorking: BelongsToAccessor<CoWorking, typeof Room.prototype.id>;
    constructor(dataSource: MongoConnectorDataSource, serviceRepositoryGetter: Getter<ServiceRepository>, serviceRepository: ServiceRepository, bookingRepositoryGetter: Getter<BookingRepository>, coWorkingRepositoryGetter: Getter<CoWorkingRepository>);
    deleteRoom(id?: string): Promise<void>;
}
