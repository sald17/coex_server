import { Service, Room } from '../models';
import { ServiceRepository } from '../repositories';
export declare class ServiceRoomController {
    serviceRepository: ServiceRepository;
    constructor(serviceRepository: ServiceRepository);
    getRoom(id: typeof Service.prototype.id): Promise<Room>;
}
