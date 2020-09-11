// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {get} from '@loopback/rest';
import {BookingRepository} from '../repositories';

// import {inject} from '@loopback/core';

export class TestController {
    constructor(
        @repository(BookingRepository)
        private bookingRepository: BookingRepository,
    ) {}

    @get('/test')
    async test() {
        // ScheduleService.agenda.define('test1', async (job: any) => {
        //     console.log('Test1');
        // });
        // ScheduleService.agenda.schedule(
        //     new Date().getTime() + 10 * 1000,
        //     'test1',
        // );
        // ScheduleService.agenda.define('test2', async (job: any) => {
        //     ScheduleService.agenda.cancel({name: 'test1'});
        //     console.log('Test2');
        // });
        // ScheduleService.agenda.schedule(
        //     new Date().getTime() + 5 * 1000,
        //     'test2',
        // );
    }
}
