export namespace BookingConstant {
    // Waitting for check in
    export const PENDING = 'PENDING';
    // Checked in
    export const ON_GOING = 'ON_GOING';
    // Checked out
    export const FINISH = 'FINISH';
    // Canceled: User không đến hoặc thực hiện cancel
    export const CANCELED = 'CANCELED';
}

export namespace TransactionConstant {
    export const PENDING = 'PENDING';
    export const ON_GOING = 'ON_GOING';
    export const SUCCESS = 'SUCCESS';
    export const CANCELED = 'CANCELED';
}

export namespace PointConstant {
    export const PointToCoin = 20000;
    export const CashToPoint = 1000;

    export namespace EXCHANGE_TYPE {
        export const BOOKING = 'BOOKING';
        export const CONVERT = 'CONVERT';
    }
    export const ON_GOING = 'ON_GOING';
    export const SUCCESS = 'SUCCESS';
    export const CANCELED = 'CANCELED';
}

export const CoinServer = 'http://dev.coinserver.unox.site';

export const filterTimeBooking = (infoStartTime: Date, infoEndTime: Date) => ({
    or: [
        {
            // TH infoTimeBooking nằm trọn bên trong
            and: [
                {
                    startTime: {
                        gte: infoStartTime, // <
                    },
                },
                {
                    endTime: {
                        lte: infoEndTime,
                    },
                },
                {status: BookingConstant.PENDING || BookingConstant.ON_GOING},
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
                {status: BookingConstant.PENDING || BookingConstant.ON_GOING},
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
                {status: BookingConstant.PENDING || BookingConstant.ON_GOING},
            ],
        },
    ],
});