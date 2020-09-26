import {inject} from '@loopback/core';
// Uncomment these imports to begin using these cool features!
import {repository} from '@loopback/repository';
import {
    get,
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
} from '@loopback/rest';
import {BookingRepository, UserRepository} from '../repositories';
import {Firebase, parseRequest, saveFiles} from '../services';

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

    @get('/test/noti')
    async testNoti() {
        const user: any = await this.userRepository.findOne({
            where: {email: 'png9981@gmail.com'},
        });
        Firebase.sendNotification(user.firebaseToken, {
            title: 'Test',
            body: 'Hello',
        });
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
