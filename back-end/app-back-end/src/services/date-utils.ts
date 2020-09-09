import {HttpErrors} from '@loopback/rest';

const validateDate = (parts: Array<any>) => {
    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (parts[1] % 400 == 0 || (parts[1] % 100 != 0 && parts[1] % 4 == 0)) {
        monthLength[1] = 29;
    }

    if (parts.length === 0 || parts.length !== 5) {
        return false;
    }
    if (
        parts[1] < 0 ||
        parts[1] > 11 ||
        parts[2] < 0 ||
        parts[2] > monthLength[parts[1]] ||
        parts[3] < 0 ||
        parts[3] > 23 ||
        parts[4] < 0 ||
        parts[4] > 59
    ) {
        return false;
    }
    return true;
};

const convertToUTC = (date: Date) => {
    var now_utc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
    );

    return new Date(now_utc);
};

// Convert string format of YYYY-MM-DD-hh-mm to Date
export function stringToDate(input: string) {
    let parts = input.split('-').map(item => Number(item));
    if (!validateDate(parts)) {
        throw new HttpErrors.BadRequest('Invalid timestamp');
    }
    const date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
    if (date.getTime() < Date.now()) {
        throw new HttpErrors.BadRequest('Invalid timestamp');
    }
    return date;
}