import { Room, CoWorking } from '../models';
import { RoomRepository } from '../repositories';
export declare class RoomCoWorkingController {
    roomRepository: RoomRepository;
    constructor(roomRepository: RoomRepository);
    getCoWorking(id: typeof Room.prototype.id): Promise<CoWorking>;
}
