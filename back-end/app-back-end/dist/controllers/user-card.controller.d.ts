import { Count, Filter, Where } from '@loopback/repository';
import { User, Card } from '../models';
import { UserRepository } from '../repositories';
export declare class UserCardController {
    protected userRepository: UserRepository;
    constructor(userRepository: UserRepository);
    find(id: string, filter?: Filter<Card>): Promise<Card[]>;
    create(id: typeof User.prototype.id, card: Omit<Card, 'id'>): Promise<Card>;
    patch(id: string, card: Partial<Card>, where?: Where<Card>): Promise<Count>;
    delete(id: string, where?: Where<Card>): Promise<Count>;
}
