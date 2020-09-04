import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {RedisConnectorDataSource} from '../datasources';
import {Blacklist} from '../models';

export class BlacklistRepository extends DefaultKeyValueRepository<Blacklist> {
    connector = this.kvModelClass.dataSource!.connector!;

    execute = promisify((cmd: string, args: any[], cb: Function) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.connector.execute!(cmd, args, cb);
    });

    constructor(
        @inject('datasources.RedisConnector')
        dataSource: RedisConnectorDataSource,
    ) {
        super(Blacklist, dataSource);
    }

    // Add token to blacklist
    async addToken(token: string) {
        try {
            await this.execute('SADD', ['blacklist', token]);
        } catch (err) {
            throw new HttpErrors.GatewayTimeout();
        }
    }

    // Return blacklist
    async getBlacklist() {
        let blacklist: any = await this.execute('SMEMBERS', ['blacklist']);
        blacklist = blacklist.map((item: any) => {
            return item.reduce((str: any, cur: any) => {
                return str.concat(String.fromCharCode(cur));
            }, '');
        });
        return blacklist;
    }

    /* Check if token in blacklist
     *
     * 1 = inside blacklist, 0 otherwise
     *
     * */
    async checkToken(token: string) {
        let result = await this.execute('SISMEMBER', ['blacklist', token]);
        return result;
    }

    // Remove expired token from blacklist
    async cleanBlacklist() {
        let blacklist = await this.getBlacklist();
        let index = blacklist.length - 1;

        console.log(`Start cleaning blacklist`);
        console.log(blacklist);
        while (blacklist.length && index >= 0) {
            console.log(blacklist[index]);
            let [token, expTime]: any = blacklist[index].split(':');
            expTime = new Date(Number(expTime) * 1000);
            if (Date.now() >= expTime) {
                await this.execute('SPOP', ['blacklist']);
                blacklist.pop();
                index--;
            } else {
                break;
            }
        }
        console.log('===========');
        console.log(`End cleaning blacklist at: ${Date.now()}`);
        console.log(blacklist);
    }

    // Check value of token in blacklist
    async check(str: string) {
        let [token, expTime]: any = str.split(':');
        expTime = new Date(Number(expTime) * 1000);
        if (Date.now() >= expTime) {
            console.log(true);
        }
        console.log(token);
        console.log(expTime);
        return {token, expTime};
    }

    // Add OTP in cache

    async addOtp(email: string, otp: string) {
        try {
            await this.execute('SET', [email, otp]);
            const res = await this.execute('EXPIRE', [email, 60 * 10]);
            if (!res) throw new HttpErrors.GatewayTimeout();
        } catch (err) {
            throw new HttpErrors.GatewayTimeout();
        }
    }

    async checkOtp(email: string, otp: string) {
        try {
            let otpVal: any = await this.execute('GET', [email]);
            console.log(otpVal);
            if (!otpVal) {
                throw new HttpErrors.GatewayTimeout();
            }
            return !otp.localeCompare(otpVal.toString());
        } catch (error) {
            throw new HttpErrors.GatewayTimeout();
        }
    }

    async deleteOtp(email: string) {
        try {
            const res: any = await this.execute('DEL', [email]);
            return Number(res.toString());
        } catch (err) {
            throw new HttpErrors.GatewayTimeout();
        }
    }

    convertByteToString(bufArr: []) {
        return bufArr.reduce((str: any, cur: any) => {
            return str.concat(String.fromCharCode(cur));
        }, '');
    }
}
