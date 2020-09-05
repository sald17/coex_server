/// <reference types="express" />
import { Count, FilterExcludingWhere, Where } from '@loopback/repository';
import { Request, Response } from '@loopback/rest';
import { CoWorking, Room, User } from '../models';
import { CoWorkingRepository, UserRepository } from '../repositories';
export declare class CoWorkingController {
    coWorkingRepository: CoWorkingRepository;
    userRepository: UserRepository;
    constructor(coWorkingRepository: CoWorkingRepository, userRepository: UserRepository);
    /**
     * Create CoWorking on user
     * Body type appl/json
     * id in URL is userID
     */
    create(id: typeof User.prototype.id, request: Request, response: Response): Promise<CoWorking>;
    /**
     * Count num of CoWorking
     */
    count(where?: Where<CoWorking>): Promise<Count>;
    find(): Promise<CoWorking[]>;
    /**
     * Find CoWorking by ID
     */
    findById(id: string, filter?: FilterExcludingWhere<CoWorking>): Promise<CoWorking>;
    /**
     * Update CoWorking by ID
     */
    updateById(id: string, coWorking: CoWorking): Promise<void>;
    /**
     * Delete CoWorking by ID
     */
    deleteById(id: string): Promise<void>;
    /**
     * Find room of coWorking by ID
     */
    findRoomOfCoWorking(id: string): Promise<Room[]>;
    /**
     * Find coWorking near me
     *
     */
    findNearCoWorking(maxDistance: number, latitude: number, longitude: number): Promise<{
        listCoWorking: (CoWorking & import("../models").CoWorkingRelations)[];
    }>;
}
