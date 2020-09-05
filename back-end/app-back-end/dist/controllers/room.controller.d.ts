/// <reference types="express" />
import { Count, FilterExcludingWhere, Where } from '@loopback/repository';
import { Request, Response } from '@loopback/rest';
import { CoWorking, Room } from '../models';
import { CoWorkingRepository, RoomRepository } from '../repositories';
import { ServiceRepository } from '../repositories/service.repository';
export declare class RoomController {
    roomRepository: RoomRepository;
    serviceRepository: ServiceRepository;
    coWorkingRepository: CoWorkingRepository;
    constructor(roomRepository: RoomRepository, serviceRepository: ServiceRepository, coWorkingRepository: CoWorkingRepository);
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
     * Get list room
     */
    find(): Promise<Room[]>;
    /**
     * Find room by id
     *
     */
    findById(id: string, filter?: FilterExcludingWhere<Room>): Promise<Room>;
    /**
     * Update room by id
     */
    updateById(id: string, room: Room): Promise<void>;
    /**
     * Delete room
     */
    deleteById(id: string): Promise<void>;
}
