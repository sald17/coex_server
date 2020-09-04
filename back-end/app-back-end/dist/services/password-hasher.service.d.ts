export declare type HashPassword = (password: string, round: number) => Promise<string>;
export interface PasswordHasher<T = string> {
    hashPassword(password: T): Promise<T>;
    comparePassword(providedPassword: T, storedPassword: T): Promise<boolean>;
}
export declare class PasswordHasherService implements PasswordHasher<string> {
    round: number;
    constructor(round: number);
    hashPassword(password: string): Promise<string>;
    comparePassword(providedPassword: string, storedPassword: string): Promise<boolean>;
    generateOTP(): Promise<string>;
    getStoreValue(token: any): string;
}
