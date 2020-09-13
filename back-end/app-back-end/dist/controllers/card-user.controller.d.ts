import { Card, User } from '../models';
import { CardRepository } from '../repositories';
export declare class CardUserController {
    cardRepository: CardRepository;
    constructor(cardRepository: CardRepository);
    getUser(id: typeof Card.prototype.id): Promise<User>;
}
