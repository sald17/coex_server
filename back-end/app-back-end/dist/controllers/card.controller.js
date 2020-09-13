"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const basic_authentication_1 = require("../access-control/authenticator/basic-authentication");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
// import {inject} from '@loopback/core';
let CardController = class CardController {
    constructor(userRepository, cardRepository, user) {
        this.userRepository = userRepository;
        this.cardRepository = cardRepository;
        this.user = user;
    }
    // Get user's card
    async getCard() {
        const id = this.user[security_1.securityId];
        return this.userRepository.cards(id).find();
    }
    // Add card to user
    async createCard(card) {
        const id = this.user[security_1.securityId];
        const existedCard = await this.cardRepository.isUniqueName(card.name);
        if (!existedCard) {
            throw new rest_1.HttpErrors.BadRequest(`Card's name is used`);
        }
        return this.userRepository.cards(id).create(card);
    }
    // Update card of user
    async patchCard(cardId, card) {
        const id = this.user[security_1.securityId];
        const existedCard = await this.cardRepository.isUniqueName(card.name);
        if (!existedCard) {
            throw new rest_1.HttpErrors.BadRequest(`Card's name is used`);
        }
        return this.userRepository.cards(id).patch(card, { id: cardId });
    }
    // Remove user's card
    async deleteCard(cardId) {
        const id = this.user[security_1.securityId];
        return this.userRepository.cards(id).delete({ id: cardId });
    }
};
tslib_1.__decorate([
    rest_1.get('/cards', {
        responses: {
            '200': {
                description: 'Array of User has many Card',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Card) },
                    },
                },
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CardController.prototype, "getCard", null);
tslib_1.__decorate([
    rest_1.post('/cards', {
        responses: {
            '200': {
                description: 'User model instance',
                content: {
                    'application/json': { schema: rest_1.getModelSchemaRef(models_1.Card) },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Card, {
                    title: 'NewCardInUser',
                    exclude: ['id'],
                    optional: ['userId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CardController.prototype, "createCard", null);
tslib_1.__decorate([
    rest_1.patch('/cards/{id}', {
        responses: {
            '200': {
                description: 'User.Card PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Card, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CardController.prototype, "patchCard", null);
tslib_1.__decorate([
    rest_1.del('/cards/{id}', {
        responses: {
            '200': {
                description: 'User.Card DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CardController.prototype, "deleteCard", null);
CardController = tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    authorization_1.authorize({
        allowedRoles: ['client'],
        voters: [basic_authentication_1.basicAuthorization],
    }),
    tslib_1.__param(0, repository_1.repository(repositories_1.UserRepository)),
    tslib_1.__param(1, repository_1.repository(repositories_1.CardRepository)),
    tslib_1.__param(2, core_1.inject(security_1.SecurityBindings.USER, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserRepository,
        repositories_1.CardRepository, Object])
], CardController);
exports.CardController = CardController;
//# sourceMappingURL=card.controller.js.map