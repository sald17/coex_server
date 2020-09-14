import { Count, Filter, Where } from '@loopback/repository';
import { User, Review } from '../models';
import { UserRepository } from '../repositories';
export declare class UserReviewController {
    protected userRepository: UserRepository;
    constructor(userRepository: UserRepository);
    find(id: string, filter?: Filter<Review>): Promise<Review[]>;
    create(id: typeof User.prototype.id, review: Omit<Review, 'id'>): Promise<Review>;
    patch(id: string, review: Partial<Review>, where?: Where<Review>): Promise<Count>;
    delete(id: string, where?: Where<Review>): Promise<Count>;
}
