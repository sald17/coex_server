import { Count, Filter, Where } from '@loopback/repository';
import { CoWorking } from '../models';
import { UserRepository } from '../repositories';
export declare class UserCoWorkingController {
    protected userRepository: UserRepository;
    constructor(userRepository: UserRepository);
    get(id: string, filter?: Filter<CoWorking>): Promise<CoWorking>;
    patch(id: string, coWorking: Partial<CoWorking>, where?: Where<CoWorking>): Promise<Count>;
    delete(id: string, where?: Where<CoWorking>): Promise<Count>;
}
