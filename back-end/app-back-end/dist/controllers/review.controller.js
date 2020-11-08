"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const repositories_1 = require("../repositories");
let ReviewController = class ReviewController {
    constructor(userRepository, coWorkingRepository, reviewRepository, bookingRepository, user) {
        this.userRepository = userRepository;
        this.coWorkingRepository = coWorkingRepository;
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.user = user;
    }
    // Create review
    async createReview(cwId, body) {
        // Check valid input
        if (!Number(body.star) || !body.content || body.content.length > 256) {
            throw new rest_1.HttpErrors.BadRequest('Invalid review');
        }
        const cw = await this.coWorkingRepository.findById(cwId);
        const isReview = await this.reviewRepository.isUserReviewed(this.user[security_1.securityId], cwId);
        const isUsed = await this.bookingRepository.checkUserRentCw(this.user[security_1.securityId], cwId);
        if (!isUsed) {
            throw new rest_1.HttpErrors.BadRequest('You need to used the service to review.');
        }
        if (isReview) {
            throw new rest_1.HttpErrors.BadRequest('Already review');
        }
        if (cw.userId === this.user[security_1.securityId]) {
            throw new rest_1.HttpErrors.Unauthorized('Cannot review your own CoWorking');
        }
        cw.starRating[body.star - 1]++;
        cw.totalRating = this.calculateRating(cw.starRating);
        const timestamp = new Date();
        const newReview = await this.reviewRepository.create({
            star: body.star,
            content: body.content,
            userId: this.user[security_1.securityId],
            coWorkingId: cwId,
            createdAt: timestamp,
            modifiedAt: timestamp,
        });
        if (!newReview) {
            throw new rest_1.HttpErrors.RequestTimeout(`Cannot create new review. Try again.`);
        }
        await this.coWorkingRepository.update(cw);
        const user = await this.userRepository.findById(this.user[security_1.securityId], {
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
    async getReviewOfCW(cwId) {
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
    async modifyReview(reviewId, body) {
        if (!Number(body.star) || !body.content || body.content.length > 256) {
            throw new rest_1.HttpErrors.BadRequest('Invalid review');
        }
        const review = await this.reviewRepository.findById(reviewId);
        if (this.user[security_1.securityId].localeCompare(review.userId)) {
            throw new rest_1.HttpErrors.Unauthorized('Cannot edit this review');
        }
        const coWorking = await this.coWorkingRepository.findById(review.coWorkingId);
        const timestamp = new Date();
        if (!coWorking) {
            throw new rest_1.HttpErrors.NotFound('Not found CoWorking');
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
    async deleteReview(reviewId) {
        const review = await this.reviewRepository.findById(reviewId);
        const cw = await this.coWorkingRepository.findById(review.coWorkingId);
        if (!review || !cw) {
            throw new rest_1.HttpErrors.NotFound('Not found entity');
        }
        if (this.user[security_1.securityId].localeCompare(review.userId)) {
            throw new rest_1.HttpErrors.Unauthorized('Cannot edit this review');
        }
        cw.starRating[review.star - 1]--;
        cw.totalRating = this.calculateRating(cw.starRating);
        await this.coWorkingRepository.update(cw);
        await this.reviewRepository.delete(review);
    }
    calculateRating(star) {
        let a = 0, b = 0;
        for (let i = 0; i < star.length; i++) {
            b += star[i];
            a += star[i] * (i + 1);
        }
        return Math.round((a / b + Number.EPSILON) * 100) / 100;
    }
};
tslib_1.__decorate([
    rest_1.post('/reviews/{cwId}'),
    tslib_1.__param(0, rest_1.param.path.string('cwId')),
    tslib_1.__param(1, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ReviewController.prototype, "createReview", null);
tslib_1.__decorate([
    rest_1.get('/reviews/{cwId}'),
    tslib_1.__param(0, rest_1.param.path.string('cwId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ReviewController.prototype, "getReviewOfCW", null);
tslib_1.__decorate([
    rest_1.patch('/reviews/{reviewId}'),
    tslib_1.__param(0, rest_1.param.path.string('reviewId')),
    tslib_1.__param(1, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ReviewController.prototype, "modifyReview", null);
tslib_1.__decorate([
    rest_1.del('/reviews/{reviewId}'),
    tslib_1.__param(0, rest_1.param.path.string('reviewId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ReviewController.prototype, "deleteReview", null);
ReviewController = tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.CoWorkingRepository)),
    tslib_1.__param(2, repository_1.repository(repositories_1.ReviewRepository)),
    tslib_1.__param(3, repository_1.repository(repositories_1.BookingRepository)),
    tslib_1.__param(4, core_1.inject(security_1.SecurityBindings.USER, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        repositories_1.CoWorkingRepository,
        repositories_1.ReviewRepository,
        repositories_1.BookingRepository, Object])
], ReviewController);
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map