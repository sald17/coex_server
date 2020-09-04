import { Count, Filter, Where } from '@loopback/repository';
import { Room, Service } from '../models';
import { RoomRepository } from '../repositories';
export declare class RoomServiceController {
    protected roomRepository: RoomRepository;
    constructor(roomRepository: RoomRepository);
    get(id: string, filter?: Filter<Service>): Promise<Service>;
    create(id: typeof Room.prototype.id, service: Omit<Service, 'id'>): Promise<Service>;
    patch(id: string, service: Partial<Service>, where?: Where<Service>): Promise<Count>;
    delete(id: string, where?: Where<Service>): Promise<Count>;
}
