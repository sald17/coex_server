import {bind, /* inject, */ BindingScope, inject} from '@loopback/core';
import * as bcrypt from 'bcryptjs';
import {PasswordHasherBindings} from '../config/key';
export type HashPassword = (password: string, round: number) => Promise<string>;

export interface PasswordHasher<T = string> {
    hashPassword(password: T): Promise<T>;
    comparePassword(providedPassword: T, storedPassword: T): Promise<boolean>;
}

@bind({scope: BindingScope.TRANSIENT})
export class PasswordHasherService implements PasswordHasher<string> {
    constructor(@inject(PasswordHasherBindings.ROUNDS) public round: number) {}
    async hashPassword(password: string): Promise<string> {
        const salt = bcrypt.genSaltSync(this.round);
        return bcrypt.hash(password, salt);
    }
    async comparePassword(
        providedPassword: string,
        storedPassword: string,
    ): Promise<boolean> {
        let isMatched = await bcrypt.compare(providedPassword, storedPassword);
        return isMatched;
    }

    async generateOTP(): Promise<string> {
        const max = 999999,
            min = 100000;

        return Math.floor(Math.random() * (max - min) + min) + '';
    }

    getStoreValue(token: any): string {
        return `${token.jti}:${token.exp}`;
    }
}
