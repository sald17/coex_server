import { Count } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
import { Card } from '../models';
import { CardRepository, UserRepository } from '../repositories';
export declare class CardController {
    userRepository: UserRepository;
    cardRepository: CardRepository;
    private user;
    constructor(userRepository: UserRepository, cardRepository: CardRepository, user: UserProfile);
    getCard(): Promise<Card[]>;
    createCard(card: Omit<Card, 'id'>): Promise<Card>;
    patchCard(cardId: string, card: Partial<Card>): Promise<Count>;
    deleteCard(cardId: string): Promise<Count>;
}
