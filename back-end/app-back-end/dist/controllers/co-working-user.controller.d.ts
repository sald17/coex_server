import { CoWorking, User } from '../models';
import { CoWorkingRepository } from '../repositories';
export declare class CoWorkingUserController {
    coWorkingRepository: CoWorkingRepository;
    constructor(coWorkingRepository: CoWorkingRepository);
    getUser(id: typeof CoWorking.prototype.id): Promise<User>;
}
