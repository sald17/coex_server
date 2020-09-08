import { Count, Filter, Where } from '@loopback/repository';
import { Room, User } from '../models';
import { UserRepository } from '../repositories';
export declare class UserRoomController {
    protected userRepository: UserRepository;
    constructor(userRepository: UserRepository);
    find(id: string, filter?: Filter<Room>): Promise<Room[]>;
    create(id: typeof User.prototype.id, room: Omit<Room, 'id'>): Promise<Room>;
    patch(id: string, room: Partial<Room>, where?: Where<Room>): Promise<Count>;
    delete(id: string, where?: Where<Room>): Promise<Count>;
}
