"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToDate = void 0;
const rest_1 = require("@loopback/rest");
const validateDate = (parts) => {
    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (parts[1] % 400 == 0 || (parts[1] % 100 != 0 && parts[1] % 4 == 0)) {
        monthLength[1] = 29;
    }
    if (parts.length === 0 || parts.length !== 5) {
        return false;
    }
    if (parts[1] < 0 ||
        parts[1] > 11 ||
        parts[2] < 0 ||
        parts[2] > monthLength[parts[1]] ||
        parts[3] < 0 ||
        parts[3] > 23 ||
        parts[4] < 0 ||
        parts[4] > 59) {
        return false;
    }
    return true;
};
const convertToUTC = (date) => {
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return new Date(now_utc);
};
// Convert string format of YYYY-MM-DD-hh-mm to Date
function stringToDate(input) {
    let parts = input.split('-').map(item => Number(item));
    if (!validateDate(parts)) {
        throw new rest_1.HttpErrors.BadRequest('Invalid timestamp');
    }
    const date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
    if (date.getTime() < Date.now()) {
        throw new rest_1.HttpErrors.BadRequest('Invalid timestamp');
    }
    return date;
}
exports.stringToDate = stringToDate;
//# sourceMappingURL=date-utils.js.map