"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTimeBooking = exports.CoinServer = exports.PointConstant = exports.TransactionConstant = exports.BookingConstant = void 0;
var BookingConstant;
(function (BookingConstant) {
    // Waitting for check in
    BookingConstant.PENDING = 'PENDING';
    // Checked in
    BookingConstant.ON_GOING = 'ON_GOING';
    // Checked out
    BookingConstant.FINISH = 'FINISH';
    // Canceled: User không đến hoặc thực hiện cancel
    BookingConstant.CANCELED = 'CANCELED';
})(BookingConstant = exports.BookingConstant || (exports.BookingConstant = {}));
var TransactionConstant;
(function (TransactionConstant) {
    TransactionConstant.PENDING = 'PENDING';
    TransactionConstant.ON_GOING = 'ON_GOING';
    TransactionConstant.SUCCESS = 'SUCCESS';
    TransactionConstant.CANCELED = 'CANCELED';
})(TransactionConstant = exports.TransactionConstant || (exports.TransactionConstant = {}));
var PointConstant;
(function (PointConstant) {
    PointConstant.PointToCoin = 20000;
    PointConstant.CashToPoint = 1000;
    let EXCHANGE_TYPE;
    (function (EXCHANGE_TYPE) {
        EXCHANGE_TYPE.BOOKING = 'BOOKING';
        EXCHANGE_TYPE.CONVERT = 'CONVERT';
    })(EXCHANGE_TYPE = PointConstant.EXCHANGE_TYPE || (PointConstant.EXCHANGE_TYPE = {}));
    PointConstant.ON_GOING = 'ON_GOING';
    PointConstant.SUCCESS = 'SUCCESS';
    PointConstant.CANCELED = 'CANCELED';
})(PointConstant = exports.PointConstant || (exports.PointConstant = {}));
exports.CoinServer = 'http://dev.coinserver.unox.site';
exports.filterTimeBooking = (infoStartTime, infoEndTime) => ({
    or: [
        {
            // TH infoTimeBooking nằm trọn bên trong
            and: [
                {
                    startTime: {
                        gte: infoStartTime,
                    },
                },
                {
                    endTime: {
                        lte: infoEndTime,
                    },
                },
                { status: BookingConstant.PENDING || BookingConstant.ON_GOING },
            ],
        },
        {
            // TH infoTimeBooking nằm lệch về phía end
            and: [
                {
                    startTime: {
                        lte: infoStartTime,
                    },
                },
                {
                    endTime: {
                        gte: infoStartTime,
                    },
                },
                { status: BookingConstant.PENDING || BookingConstant.ON_GOING },
            ],
        },
        {
            // TH infoTimeBooking nằm lệch về phía start
            and: [
                {
                    startTime: {
                        lte: infoEndTime,
                    },
                },
                {
                    endTime: {
                        gte: infoEndTime,
                    },
                },
                { status: BookingConstant.PENDING || BookingConstant.ON_GOING },
            ],
        },
    ],
});
//# sourceMappingURL=constants.js.map