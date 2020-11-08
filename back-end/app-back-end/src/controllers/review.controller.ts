// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
    del,
    get,
    HttpErrors,
    param,
    patch,
    post,
    requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {
    BookingRepository,
    CoWorkingRepository,
    ReviewRepository,
    UserRepository,
} from '../repositories';

@authenticate('jwt')
export class ReviewController {
    constructor(
        @repository(UserRepository) private userRepository: UserRepository,
        @repository(CoWorkingRepository)
        private coWorkingRepository: CoWorkingRepository,
        @repository(ReviewRepository)
        private reviewRepository: ReviewRepository,
        @repository(BookingRepository)
        private bookingRepository: BookingRepository,
        @inject(SecurityBindings.USER, {optional: true})
        private user: UserProfile,
    ) {}

    // Create review
    @post('/reviews/{cwId}')
    async createReview(
        @param.path.string('cwId') cwId: string,
        @requestBody() body: {star: number; content: string},
    ) {
        // Check valid input
        if (!Number(body.star) || !body.content || body.content.length > 256) {
            throw new HttpErrors.BadRequest('Invalid review');
        }

        const cw = await this.coWorkingRepository.findById(cwId);
        const isReview = await this.reviewRepository.isUserReviewed(
            this.user[securityId],
            cwId,
        );
        const isUsed = await this.bookingRepository.checkUserRentCw(
            this.user[securityId],
            cwId,
        );
        if (!isUsed) {
            throw new HttpErrors.BadRequest(
                'You need to used the service to review.',
            );
        }
        if (isReview) {
            throw new HttpErrors.BadRequest('Already review');
        }
        if (cw.userId === this.user[securityId]) {
            throw new HttpErrors.Unauthorized(
                'Cannot review your own CoWorking',
            );
        }

        cw.starRating[body.star - 1]++;
        cw.totalRating = this.calculateRating(cw.starRating);
        const timestamp = new Date();

        const newReview: any = await this.reviewRepository.create({
            star: body.star,
            content: body.content,
            userId: this.user[securityId],
            coWorkingId: cwId,
            createdAt: timestamp,
            modifiedAt: timestamp,
        });
        if (!newReview) {
            throw new HttpErrors.RequestTimeout(
                `Cannot create new review. Try again.`,
            );
        }
        await this.coWorkingRepository.update(cw);
        const user = await this.userRepository.findById(this.user[securityId], {
            fields: {
                id: true,
                fullname: true,
                email: true,
                avatar: true,
            },
        });
        newReview.user = user;
        return newReview;
    }

    // Gett review of CW by cwId
    @get('/reviews/{cwId}')
    async getReviewOfCW(@param.path.string('cwId') cwId: string) {
        return this.coWorkingRepository.findById(cwId, {
            fields: {
                userId: false,
                createdAt: false,
                modifiedAt: false,
                starRating: false,
            },
            include: [
                {
                    relation: 'reviews',
                    scope: {
                        include: [
                            {
                                relation: 'user',
                                scope: {
                                    fields: {
                                        id: true,
                                        email: true,
                                        fullname: true,
                                        avatar: true,
                                    },
                                },
                            },
                        ],
                        order: ['createdAt DESC'],
                    },
                },
            ],
        });
    }
    // Modify review
    @patch('/reviews/{reviewId}')
    async modifyReview(
        @param.path.string('reviewId') reviewId: string,
        @requestBody()
        body: {star: number; content: string},
    ) {
        if (!Number(body.star) || !body.content || body.content.length > 256) {
            throw new HttpErrors.BadRequest('Invalid review');
        }
        const review = await this.reviewRepository.findById(reviewId);
        if (this.user[securityId].localeCompare(review.userId)) {
            throw new HttpErrors.Unauthorized('Cannot edit this review');
        }

        const coWorking = await this.coWorkingRepository.findById(
            review.coWorkingId,
        );
        const timestamp = new Date();

        if (!coWorking) {
            throw new HttpErrors.NotFound('Not found CoWorking');
        }

        if (body.star !== review.star) {
            coWorking.starRating[review.star - 1]--;
            coWorking.starRating[body.star - 1]++;
            coWorking.totalRating = this.calculateRating(coWorking.starRating);
            review.star = body.star;
            await this.coWorkingRepository.update(coWorking);
        }

        review.content = body.content;

        await this.reviewRepository.update(review);
    }

    @del('/reviews/{reviewId}')
    async deleteReview(@param.path.string('reviewId') reviewId: string) {
        const review = await this.reviewRepository.findById(reviewId);
        const cw = await this.coWorkingRepository.findById(review.coWorkingId);
        if (!review || !cw) {
            throw new HttpErrors.NotFound('Not found entity');
        }
        if (this.user[securityId].localeCompare(review.userId)) {
            throw new HttpErrors.Unauthorized('Cannot edit this review');
        }
        cw.starRating[review.star - 1]--;
        cw.totalRating = this.calculateRating(cw.starRating);
        await this.coWorkingRepository.update(cw);
        await this.reviewRepository.delete(review);
    }

    calculateRating(star: number[]) {
        let a = 0,
            b = 0;
        for (let i = 0; i < star.length; i++) {
            b += star[i];
            a += star[i] * (i + 1);
        }

        return Math.round((a / b + Number.EPSILON) * 100) / 100;
    }
}
