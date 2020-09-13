// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {Count, CountSchema, repository} from '@loopback/repository';
import {
    del,
    get,
    getModelSchemaRef,
    HttpErrors,
    param,
    patch,
    post,
    requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {basicAuthorization} from '../access-control/authenticator/basic-authentication';
import {Card} from '../models';
import {CardRepository, UserRepository} from '../repositories';

// import {inject} from '@loopback/core';

@authenticate('jwt')
@authorize({
    allowedRoles: ['client'],
    voters: [basicAuthorization],
})
export class CardController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(CardRepository) public cardRepository: CardRepository,
        @inject(SecurityBindings.USER, {optional: true})
        private user: UserProfile,
    ) {}

    // Get user's card

    @get('/cards', {
        responses: {
            '200': {
                description: 'Array of User has many Card',
                content: {
                    'application/json': {
                        schema: {type: 'array', items: getModelSchemaRef(Card)},
                    },
                },
            },
        },
    })
    async getCard(): Promise<Card[]> {
        const id = this.user[securityId];
        return this.userRepository.cards(id).find();
    }

    // Add card to user
    @post('/cards', {
        responses: {
            '200': {
                description: 'User model instance',
                content: {
                    'application/json': {schema: getModelSchemaRef(Card)},
                },
            },
        },
    })
    async createCard(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Card, {
                        title: 'NewCardInUser',
                        exclude: ['id'],
                        optional: ['userId'],
                    }),
                },
            },
        })
        card: Omit<Card, 'id'>,
    ): Promise<Card> {
        const id = this.user[securityId];
        const existedCard = await this.cardRepository.isUniqueName(card.name);
        if (!existedCard) {
            throw new HttpErrors.BadRequest(`Card's name is used`);
        }
        return this.userRepository.cards(id).create(card);
    }

    // Update card of user
    @patch('/cards/{id}', {
        responses: {
            '200': {
                description: 'User.Card PATCH success count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async patchCard(
        @param.path.string('id') cardId: string,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Card, {partial: true}),
                },
            },
        })
        card: Partial<Card>,
    ) {
        const id = this.user[securityId];
        const existedCard = await this.cardRepository.isUniqueName(card.name);
        if (!existedCard) {
            throw new HttpErrors.BadRequest(`Card's name is used`);
        }
        return this.userRepository.cards(id).patch(card, {id: cardId});
    }

    // Remove user's card
    @del('/cards/{id}', {
        responses: {
            '200': {
                description: 'User.Card DELETE success count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async deleteCard(@param.path.string('id') cardId: string): Promise<Count> {
        const id = this.user[securityId];
        return this.userRepository.cards(id).delete({id: cardId});
    }
}
