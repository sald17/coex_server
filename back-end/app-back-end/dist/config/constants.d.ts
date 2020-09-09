export declare namespace BookingConstant {
    const PENDING = "PENDING";
    const ON_GOING = "ON_GOING";
    const FINISH = "FINISH";
    const CANCELED = "CANCELED";
}
export declare namespace TransactionConstant {
    const PENDING = "PENDING";
    const ON_GOING = "ON_GOING";
    const SUCCESS = "SUCCESS";
    const CANCELED = "CANCELED";
}
export declare namespace PointConstant {
    const PointToCoin = 20000;
    const CashToPoint = 1000;
    namespace EXCHANGE_TYPE {
        const BOOKING = "BOOKING";
        const CONVERT = "CONVERT";
    }
    const ON_GOING = "ON_GOING";
    const SUCCESS = "SUCCESS";
    const CANCELED = "CANCELED";
}
export declare const CoinServer = "http://dev.coinserver.unox.site";
export declare const filterTimeBooking: (infoStartTime: Date, infoEndTime: Date) => {
    or: ({
        and: ({
            startTime: {
                gte: Date;
            };
            endTime?: undefined;
            status?: undefined;
        } | {
            endTime: {
                lte: Date;
            };
            startTime?: undefined;
            status?: undefined;
        } | {
            status: string;
            startTime?: undefined;
            endTime?: undefined;
        })[];
    } | {
        and: ({
            startTime: {
                lte: Date;
            };
            endTime?: undefined;
            status?: undefined;
        } | {
            endTime: {
                gte: Date;
            };
            startTime?: undefined;
            status?: undefined;
        } | {
            status: string;
            startTime?: undefined;
            endTime?: undefined;
        })[];
    })[];
};