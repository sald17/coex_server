import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
    Count,
    CountSchema,
    FilterExcludingWhere,
    repository,
    Where,
} from '@loopback/repository';
import {
    del,
    get,
    getModelSchemaRef,
    HttpErrors,
    param,
    patch,
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
} from '@loopback/rest';
import {basicAuthorization} from '../access-control/authenticator/basic-authentication';
import {CoWorking, Room, Service} from '../models';
import {CoWorkingRepository, RoomRepository} from '../repositories';
import {ServiceRepository} from '../repositories/service.repository';
import {deleteFiles, parseRequest, saveFiles} from '../services/file-upload';

export class RoomController {
    constructor(
        @repository(RoomRepository)
        public roomRepository: RoomRepository,
        @repository(ServiceRepository)
        public serviceRepository: ServiceRepository,
        @repository(CoWorkingRepository)
        public coWorkingRepository: CoWorkingRepository,
    ) {}

    /**
     * Create room on CoWorking
     * id in URL is coWorkingID
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @post('/co-workings/{id}/rooms', {
        responses: {
            '200': {
                description: 'CoWorking model instance',
            },
        },
    })
    async create(
        @param.path.string('id') id: typeof CoWorking.prototype.id,
        @requestBody({
            description: 'Create room',
            required: true,
            content: {
                'multipart/form-data': {
                    'x-parser': 'stream',
                    schema: {
                        type: 'object',
                        properties: {
                            room: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        })
        request: Request,
        @inject(RestBindings.Http.RESPONSE)
        response: Response,
    ) {
        const req: any = await parseRequest(request, response);
        const preService = JSON.parse(req.fields.service);
        const uploadFile: any = await saveFiles(req.files);
        if (uploadFile.error) {
            throw new HttpErrors.BadRequest(uploadFile.message);
        }

        req.fields.photo = uploadFile;
        const service = new Service(preService);

        delete req.fields.service;
        const room = new Room(req.fields);
        const newRoom = await this.coWorkingRepository.rooms(id).create(room);
        const newService = await this.roomRepository
            .service(newRoom.id)
            .create(service);
        newRoom.service = newService;
        return newRoom;
    }

    /**
     * Get room count
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/rooms/count', {
        responses: {
            '200': {
                description: 'Room model count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async count(@param.where(Room) where?: Where<Room>): Promise<Count> {
        return this.roomRepository.count(where);
    }

    /**
     * Get list of all room
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/rooms', {
        responses: {
            '200': {
                description: 'Array of Room model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(Room, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    })
    async find(): Promise<Room[]> {
        return this.roomRepository.find({include: [{relation: 'service'}]});
    }

    /**
     * Find room by id
     *
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/rooms/{id}', {
        responses: {
            '200': {
                description: 'Room model instance',
                content: {
                    'application/json': {
                        schema: getModelSchemaRef(Room, {
                            includeRelations: true,
                        }),
                    },
                },
            },
        },
    })
    async findById(
        @param.path.string('id') id: string,
        @param.filter(Room, {exclude: 'where'})
        filter?: FilterExcludingWhere<Room>,
    ): Promise<Room> {
        return this.roomRepository.findById(id, filter);
    }

    /**
     * Update room by id
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @patch('/rooms/{id}', {
        responses: {
            '204': {
                description: 'Room PATCH success',
            },
        },
    })
    async updateById(
        @param.path.string('id') id: string,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Room, {partial: true}),
                },
            },
        })
        room: Room,
    ): Promise<void> {
        await this.roomRepository.updateById(id, room);
    }

    /**
     * Delete room
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @del('/rooms/{id}', {
        responses: {
            '204': {
                description: 'Room DELETE success',
            },
        },
    })
    async deleteById(@param.path.string('id') id: string): Promise<void> {
        const room = await this.roomRepository.findById(id);
        this.serviceRepository.deleteById(room.service.id);
        delete room.service;
        deleteFiles(room.photo);
        await this.roomRepository.delete(room);
    }
}
