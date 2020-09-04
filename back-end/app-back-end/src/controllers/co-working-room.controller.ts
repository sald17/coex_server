import {Count, CountSchema, repository, Where} from '@loopback/repository';
import {
    del,
    getModelSchemaRef,
    getWhereSchemaFor,
    param,
    patch,
    requestBody,
} from '@loopback/rest';
import {Room} from '../models';
import {CoWorkingRepository} from '../repositories';

export class CoWorkingRoomController {
    constructor(
        @repository(CoWorkingRepository)
        protected coWorkingRepository: CoWorkingRepository,
    ) {}

    // @post('/co-workings/{id}/rooms', {
    //     responses: {
    //         '200': {
    //             description: 'CoWorking model instance',
    //             content: {
    //                 'application/json': {schema: getModelSchemaRef(Room)},
    //             },
    //         },
    //     },
    // })
    // async create(
    //     @param.path.string('id') id: typeof CoWorking.prototype.id,
    //     @requestBody({
    //         content: {
    //             'application/json': {
    //                 schema: getModelSchemaRef(Room, {
    //                     title: 'NewRoomInCoWorking',
    //                     exclude: ['id'],
    //                     optional: ['coWorkingId'],
    //                 }),
    //             },
    //         },
    //     })
    //     room: Omit<Room, 'id'>,
    // ): Promise<Room> {
    //     return this.coWorkingRepository.rooms(id).create(room);
    // }

    @patch('/co-workings/{id}/rooms', {
        responses: {
            '200': {
                description: 'CoWorking.Room PATCH success count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async patch(
        @param.path.string('id') id: string,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Room, {partial: true}),
                },
            },
        })
        room: Partial<Room>,
        @param.query.object('where', getWhereSchemaFor(Room))
        where?: Where<Room>,
    ): Promise<Count> {
        return this.coWorkingRepository.rooms(id).patch(room, where);
    }

    @del('/co-workings/{id}/rooms', {
        responses: {
            '200': {
                description: 'CoWorking.Room DELETE success count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async delete(
        @param.path.string('id') id: string,
        @param.query.object('where', getWhereSchemaFor(Room))
        where?: Where<Room>,
    ): Promise<Count> {
        return this.coWorkingRepository.rooms(id).delete(where);
    }
}
