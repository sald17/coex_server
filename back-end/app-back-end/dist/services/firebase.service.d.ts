export declare class Firebase {
    static sendNotification(firebaseToken: string[], noti: {
        title: string;
        body: string;
    }): Promise<import("firebase-admin/lib/messaging").admin.messaging.BatchResponse | {
        error: boolean;
        message: any;
    } | undefined>;
    static remindCheckInClient(tokens: string[], bookingRef: string, before: number): Promise<void>;
    static remindCheckInHost(tokens: string[], clientName: string, bookingRef: string, before: number): Promise<void>;
    static remindCheckOutClient(tokens: string[], bookingRef: string, before: number): Promise<void>;
    static remindCheckOutHost(tokens: string[], clientName: string, bookingRef: string, before: number): Promise<void>;
    static notifyHostNewBooking(tokens: string[], name: string, bookingRef: string): Promise<void>;
    static notifyHostUpdatedBooking(tokens: string[], bookingRef: string): Promise<void>;
    static notifyClientCheckInOverTime(tokens: string[], bookingRef: string): Promise<void>;
    static notifyHostCheckInOverTime(tokens: string[], bookingRef: string): Promise<void>;
    static notifyClientCheckOutOverTime(tokens: string[], bookingRef: string): Promise<void>;
    static notifyHostCheckOutOverTime(tokens: string[], bookingRef: string): Promise<void>;
    static notifyCancelBooking(tokens: string[], bookingRef: string): Promise<void>;
    static notifyClientCheckIn(tokens: string[], roomName: any, bookingRef: string): Promise<void>;
    static notifyHostCheckIn(tokens: string[], clientName: any, roomName: any, bookingRef: string): Promise<void>;
    static notifyPoint(tokens: string[], point: number, bookingRef: string): Promise<void>;
    static notifyHostCheckOut(tokens: string[], userName: any, bookingRef: string): Promise<void>;
}
