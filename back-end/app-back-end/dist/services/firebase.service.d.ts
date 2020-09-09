export declare class Firebase {
    static sendNotification(firebaseToken: string, noti: {
        title: string;
        body: string;
    }): Promise<string | {
        error: boolean;
        message: any;
    }>;
}
