"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const util_1 = require("util");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let BlacklistRepository = class BlacklistRepository extends repository_1.DefaultKeyValueRepository {
    constructor(dataSource) {
        super(models_1.Blacklist, dataSource);
        this.connector = this.kvModelClass.dataSource.connector;
        this.execute = util_1.promisify((cmd, args, cb) => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.connector.execute(cmd, args, cb);
        });
    }
    async addToken(token) {
        try {
            await this.execute('SADD', ['blacklist', token]);
        }
        catch (err) {
            throw new rest_1.HttpErrors.GatewayTimeout();
        }
    }
    async getBlacklist() {
        let blacklist = await this.execute('SMEMBERS', ['blacklist']);
        blacklist = blacklist.map((item) => {
            return item.reduce((str, cur) => {
                return str.concat(String.fromCharCode(cur));
            }, '');
        });
        return blacklist;
    }
    async checkToken(token) {
        let result = await this.execute('SISMEMBER', ['blacklist', token]);
        return result;
    }
    async cleanBlacklist() {
        let blacklist = await this.getBlacklist();
        let index = blacklist.length - 1;
        console.log(`Start cleaning blacklist`);
        console.log(blacklist);
        while (blacklist.length && index >= 0) {
            console.log(blacklist[index]);
            let [token, expTime] = blacklist[index].split(':');
            expTime = new Date(Number(expTime) * 1000);
            if (Date.now() >= expTime) {
                await this.execute('SPOP', ['blacklist']);
                blacklist.pop();
                index--;
            }
            else {
                break;
            }
        }
        console.log('===========');
        console.log(`End cleaning blacklist at: ${Date.now()}`);
        console.log(blacklist);
    }
    async check(str) {
        let [token, expTime] = str.split(':');
        expTime = new Date(Number(expTime) * 1000);
        if (Date.now() >= expTime) {
            console.log(true);
        }
        console.log(token);
        console.log(expTime);
        return { token, expTime };
    }
};
BlacklistRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.RedisConnector')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.RedisConnectorDataSource])
], BlacklistRepository);
exports.BlacklistRepository = BlacklistRepository;
//# sourceMappingURL=blacklist.repository.js.map