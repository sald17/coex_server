import {inject} from '@loopback/core';
// Uncomment these imports to begin using these cool features!
import {repository} from '@loopback/repository';
import {
    get,
    param,
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
} from '@loopback/rest';
import {BookingRepository, UserRepository} from '../repositories';
import {parseRequest, saveFiles} from '../services';

// import {inject} from '@loopback/core';

export class TestController {
    constructor(
        @repository(BookingRepository)
        private bookingRepository: BookingRepository,
        @repository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    @get('/test/message')
    async test() {
        return 'Jebaited';
    }

    @get('/test/check/{userId}/{cwId}')
    async check(
        @param.path.string('userId') userId: string,
        @param.path.string('cwId') cwId: string,
    ) {
        return await this.bookingRepository.checkUserRentCw(userId, cwId);
    }

    @get('/test/noti')
    async testNoti() {
        const user = await this.userRepository.findById(
            '5f51f6fa7fb4e46e69d60009',
            {
                fields: {
                    id: true,
                    fullname: true,
                    avatar: true,
                },
            },
        );
        return user;
    }

    @post('/test/upload')
    async create(
        @requestBody({
            description: 'Create coworking',
            required: true,
            content: {
                'multipart/form-data': {
                    'x-parser': 'stream',
                    schema: {
                        type: 'object',
                        properties: {
                            coworking: {
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
        console.log(req);
        const uploadFile: any = await saveFiles(req.files);
        return uploadFile;
    }
}
