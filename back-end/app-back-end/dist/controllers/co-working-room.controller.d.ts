import { Count, Where } from '@loopback/repository';
import { Room } from '../models';
import { CoWorkingRepository } from '../repositories';
export declare class CoWorkingRoomController {
    protected coWorkingRepository: CoWorkingRepository;
    constructor(coWorkingRepository: CoWorkingRepository);
    patch(id: string, room: Partial<Room>, where?: Where<Room>): Promise<Count>;
    delete(id: string, where?: Where<Room>): Promise<Count>;
}
