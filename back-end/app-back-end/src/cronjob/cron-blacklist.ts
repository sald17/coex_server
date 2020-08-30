import {CronJob, cronJob} from '@loopback/cron';
import {repository} from '@loopback/repository';
import {BlacklistRepository} from '../repositories';

@cronJob()
export class BlacklistCron extends CronJob {
    constructor(
        @repository(BlacklistRepository) private blacklist: BlacklistRepository,
    ) {
        super({
            name: 'Blacklist',
            onTick: () => {
                blacklist.cleanBlacklist();
            },
            start: false,
            cronTime: '*/10 * * * * *',
            runOnInit: false,
        });
    }
}
