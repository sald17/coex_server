"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToDate = void 0;
const rest_1 = require("@loopback/rest");
const validateDate = (parts) => {
    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (parts[0] % 400 == 0 || (parts[0] % 100 != 0 && parts[0] % 4 == 0)) {
        monthLength[1] = 29;
    }
    // console.log(monthLength[parts[1]]);
    if (parts.length === 0 || parts.length !== 5) {
        return false;
    }
    if (parts[1] < 1 ||
        parts[1] > 12 ||
        parts[2] < 1 ||
        parts[2] > monthLength[parts[1] - 1] ||
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
function stringToDate(input, validate = true) {
    let parts = input.split('-').map(item => Number(item));
    // console.log(parts);
    if (!validateDate(parts)) {
        throw new rest_1.HttpErrors.BadRequest('Invalid timestamp');
    }
    const date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
    // console.log(date.toString());
    if (date.getTime() < Date.now() && validate) {
        throw new rest_1.HttpErrors.BadRequest('Invalid timestamp');
    }
    return date;
}
exports.stringToDate = stringToDate;
//# sourceMappingURL=date-utils.js.map