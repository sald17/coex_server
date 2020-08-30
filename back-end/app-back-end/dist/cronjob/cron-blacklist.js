"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistCron = void 0;
const tslib_1 = require("tslib");
const cron_1 = require("@loopback/cron");
const repository_1 = require("@loopback/repository");
const repositories_1 = require("../repositories");
let BlacklistCron = class BlacklistCron extends cron_1.CronJob {
    constructor(blacklist) {
        super({
            name: 'Blacklist',
            onTick: () => {
                blacklist.cleanBlacklist();
            },
            start: false,
            cronTime: '*/10 * * * * *',
            runOnInit: false,
        });
        this.blacklist = blacklist;
    }
};
BlacklistCron = tslib_1.__decorate([
    cron_1.cronJob(),
    tslib_1.__param(0, repository_1.repository(repositories_1.BlacklistRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.BlacklistRepository])
], BlacklistCron);
exports.BlacklistCron = BlacklistCron;
//# sourceMappingURL=cron-blacklist.js.map