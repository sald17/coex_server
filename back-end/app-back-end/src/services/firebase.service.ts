import * as admin from 'firebase-admin';

export class Firebase {
    static async sendNotification(
        firebaseToken: string,
        noti: {title: string; body: string},
    ) {
        try {
            const message = {
                notification: noti,
                token: firebaseToken,
            };
            const result = await admin.messaging().send(message);
            return result;
        } catch (err) {
            return {error: true, message: err.message};
        }
    }
}
