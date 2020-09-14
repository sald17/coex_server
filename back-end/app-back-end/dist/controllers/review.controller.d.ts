import { UserProfile } from '@loopback/security';
import { CoWorkingRepository, ReviewRepository, UserRepository } from '../repositories';
export declare class ReviewController {
    private userRepository;
    private coWorkingRepository;
    private reviewRepository;
    private user;
    constructor(userRepository: UserRepository, coWorkingRepository: CoWorkingRepository, reviewRepository: ReviewRepository, user: UserProfile);
    createReview(cwId: string, body: {
        star: number;
        content: string;
    }): Promise<import("../models").Review>;
    getReviewOfCW(cwId: string): Promise<import("../models").CoWorking & import("../models").CoWorkingRelations>;
    modifyReview(reviewId: string, body: {
        star: number;
        content: string;
    }): Promise<void>;
    deleteReview(reviewId: string): Promise<void>;
    calculateRating(star: number[]): number;
}
