import { Count, Filter, Where } from '@loopback/repository';
import { CoWorking, Review } from '../models';
import { CoWorkingRepository } from '../repositories';
export declare class CoWorkingReviewController {
    protected coWorkingRepository: CoWorkingRepository;
    constructor(coWorkingRepository: CoWorkingRepository);
    find(id: string, filter?: Filter<Review>): Promise<Review[]>;
    create(id: typeof CoWorking.prototype.id, review: Omit<Review, 'id'>): Promise<Review>;
    patch(id: string, review: Partial<Review>, where?: Where<Review>): Promise<Count>;
    delete(id: string, where?: Where<Review>): Promise<Count>;
}
