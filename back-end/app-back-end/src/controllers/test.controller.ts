// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {get} from '@loopback/rest';
import {BookingRepository, UserRepository} from '../repositories';
import {Firebase} from '../services';

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
}
