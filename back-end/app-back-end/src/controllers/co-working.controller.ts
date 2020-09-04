import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
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
    requestBody,
} from '@loopback/rest';
import {basicAuthorization} from '../access-control/authenticator/basic-authentication';
import {CoWorking, Room, User} from '../models';
import {CoWorkingRepository, UserRepository} from '../repositories';

export class CoWorkingController {
    constructor(
        @repository(CoWorkingRepository)
        public coWorkingRepository: CoWorkingRepository,
        @repository(UserRepository) public userRepository: UserRepository,
    ) {}

    /**
     * Create CoWorking on user
     * Body type appl/json
     * id in URL is userID
     */

    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @post('/users/{id}/co-working', {
        responses: {
            '200': {
                description: 'User model instance',
                content: {
                    'application/json': {schema: getModelSchemaRef(CoWorking)},
                },
            },
        },
    })
    async create(
        @param.path.string('id') id: typeof User.prototype.id,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(CoWorking, {
                        title: 'NewCoWorkingInUser',
                        exclude: ['id'],
                        optional: ['userId'],
                    }),
                },
            },
        })
        coWorking: Omit<CoWorking, 'id'>,
    ): Promise<CoWorking> {
        const coCreated = await this.coWorkingRepository.findOne({
            where: {
                userId: id,
            },
        });
        if (coCreated) {
            throw new HttpErrors.BadRequest(
                'User already register to a CoWorking',
            );
        }
        // return new CoWorking();
        return this.userRepository.coWorking(id).create(coWorking);
    }

    /**
     * Count num of CoWorking
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/co-workings/count', {
        responses: {
            '200': {
                description: 'CoWorking model count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    async count(
        @param.where(CoWorking) where?: Where<CoWorking>,
    ): Promise<Count> {
        return this.coWorkingRepository.count(where);
    }

    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/co-workings', {
        responses: {
            '200': {
                description: 'Array of CoWorking model instances',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(CoWorking, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    })
    async find(): Promise<CoWorking[]> {
        return this.coWorkingRepository.find({include: [{relation: 'user'}]});
    }

    /**
     * Find CoWorking by ID
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: [],
        voters: [basicAuthorization],
    })
    @get('/co-workings/{id}', {
        responses: {
            '200': {
                description: 'CoWorking model instance',
                content: {
                    'application/json': {
                        schema: getModelSchemaRef(CoWorking, {
                            includeRelations: true,
                        }),
                    },
                },
            },
        },
    })
    async findById(
        @param.path.string('id') id: string,
        @param.filter(CoWorking, {exclude: 'where'})
        filter?: FilterExcludingWhere<CoWorking>,
    ): Promise<CoWorking> {
        return this.coWorkingRepository.findById(id, filter);
    }

    /**
     * Update CoWorking by ID
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @patch('/co-workings/{id}', {
        responses: {
            '204': {
                description: 'CoWorking PATCH success',
            },
        },
    })
    async updateById(
        @param.path.string('id') id: string,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(CoWorking, {partial: true}),
                },
            },
        })
        coWorking: CoWorking,
    ): Promise<void> {
        await this.coWorkingRepository.updateById(id, coWorking);
    }

    /**
     * Delete CoWorking by ID
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @del('/co-workings/{id}', {
        responses: {
            '204': {
                description: 'CoWorking DELETE success',
            },
        },
    })
    async deleteById(@param.path.string('id') id: string): Promise<void> {
        await this.coWorkingRepository.deleteById(id);
    }

    /**
     * Find room of coWorking by ID
     */
    @authenticate('jwt')
    @authorize({
        allowedRoles: ['host'],
        voters: [basicAuthorization],
    })
    @get('/co-workings/{id}/rooms', {
        responses: {
            '200': {
                description: 'Array of CoWorking has many Room',
                content: {
                    'application/json': {
                        schema: {type: 'array', items: getModelSchemaRef(Room)},
                    },
                },
            },
        },
    })
    async findRoomOfCoWorking(
        @param.path.string('id') id: string,
    ): Promise<Room[]> {
        return this.coWorkingRepository
            .rooms(id)
            .find({include: [{relation: 'service'}]});
    }
}
