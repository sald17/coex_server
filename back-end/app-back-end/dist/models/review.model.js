"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const co_working_model_1 = require("./co-working.model");
const user_model_1 = require("./user.model");
let Review = class Review extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], Review.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Review.prototype, "content", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Review.prototype, "star", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Review.prototype, "modifiedAt", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => user_model_1.User),
    tslib_1.__metadata("design:type", String)
], Review.prototype, "userId", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => co_working_model_1.CoWorking),
    tslib_1.__metadata("design:type", String)
], Review.prototype, "coWorkingId", void 0);
Review = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Review);
exports.Review = Review;
//# sourceMappingURL=review.model.js.map