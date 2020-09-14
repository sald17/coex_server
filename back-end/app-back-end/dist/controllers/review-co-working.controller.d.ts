import { Review, CoWorking } from '../models';
import { ReviewRepository } from '../repositories';
export declare class ReviewCoWorkingController {
    reviewRepository: ReviewRepository;
    constructor(reviewRepository: ReviewRepository);
    getCoWorking(id: typeof Review.prototype.id): Promise<CoWorking>;
}
