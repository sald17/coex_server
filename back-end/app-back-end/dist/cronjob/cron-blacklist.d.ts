import { CronJob } from '@loopback/cron';
import { BlacklistRepository } from '../repositories';
export declare class BlacklistCron extends CronJob {
    private blacklist;
    constructor(blacklist: BlacklistRepository);
}
