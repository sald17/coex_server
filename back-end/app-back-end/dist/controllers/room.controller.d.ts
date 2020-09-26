/// <reference types="express" />
import { Count, Where } from '@loopback/repository';
import { Request, Response } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { CoWorking, Room } from '../models';
import { CoWorkingRepository, RoomRepository } from '../repositories';
import { ServiceRepository } from '../repositories/service.repository';
export declare class RoomController {
    roomRepository: RoomRepository;
    serviceRepository: ServiceRepository;
    coWorkingRepository: CoWorkingRepository;
    user: UserProfile;
    constructor(roomRepository: RoomRepository, serviceRepository: ServiceRepository, coWorkingRepository: CoWorkingRepository, user: UserProfile);
    /**
     * Create room on CoWorking
     * id in URL is coWorkingID
     */
    create(id: typeof CoWorking.prototype.id, request: Request, response: Response): Promise<Room>;
    /**
     * Get room count
     */
    count(where?: Where<Room>): Promise<Count>;
    /**
     * Get list of all room
     */
    find(): Promise<Room[]>;
    /**
     * Find room by id
     *
     */
    findById(id: string): Promise<Room>;
    /**
     * Update room by id
     */
    updateById(id: string, request: Request, response: Response): Promise<void>;
    /**
     * Delete room
     */
    deleteById(id: string): Promise<void>;
}
