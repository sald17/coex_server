// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {get} from '@loopback/rest';
import {BookingRepository} from '../repositories';
import {ScheduleService} from '../services/schedule.service';

// import {inject} from '@loopback/core';

export class TestController {
    constructor(
        @repository(BookingRepository)
        private bookingRepository: BookingRepository,
    ) {}

    @get('/test')
    async test() {
        ScheduleService.verifyCheckIn('5f59050d393bb3e7a95760e0', new Date());
    }
}
