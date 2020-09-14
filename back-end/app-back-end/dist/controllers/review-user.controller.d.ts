import { Review, User } from '../models';
import { ReviewRepository } from '../repositories';
export declare class ReviewUserController {
    reviewRepository: ReviewRepository;
    constructor(reviewRepository: ReviewRepository);
    getUser(id: typeof Review.prototype.id): Promise<User>;
}
