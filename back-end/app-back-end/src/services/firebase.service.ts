import * as admin from 'firebase-admin';

export class Firebase {
    static async sendNotification(
        firebaseToken: string[],
        noti: {title: string; body: string},
    ) {
        try {
            if (!firebaseToken || firebaseToken.length === 0) {
                return;
            }
            const message = {
                notification: noti,
                tokens: firebaseToken,
            };
            const result = await admin.messaging().sendMulticast(message);
            return result;
        } catch (err) {
            return {error: true, message: err.message};
        }
    }

    //Reminder Check in
    static async remindCheckInClient(
        tokens: string[],
        bookingRef: string,
        before: number,
    ) {
        const noti = {
            title: 'Check In Remider',
            body: `Your booking #${bookingRef} is starting in ${before} minutes.`,
        };
        await this.sendNotification(tokens, noti);
    }

    static async remindCheckInHost(
        tokens: string[],
        clientName: string,
        bookingRef: string,
        before: number,
    ) {
        const noti = {
            title: 'Check In Remider',
            body: `You have booking #${bookingRef} with ${clientName} in ${before} minutes`,
        };
        await this.sendNotification(tokens, noti);
    }

    //Reminder Check out
    static async remindCheckOutClient(
        tokens: string[],
        bookingRef: string,
        before: number,
    ) {
        const noti = {
            title: 'Check Out Remider',
            body: `Your booking #${bookingRef} is ending in ${before} minutes.`,
        };
        await this.sendNotification(tokens, noti);
    }

    static async remindCheckOutHost(
        tokens: string[],
        clientName: string,
        bookingRef: string,
        before: number,
    ) {
        const noti = {
            title: 'Check Out Remider',
            body: `Booking #${bookingRef} with ${clientName} is ending in ${before} minutes`,
        };
        await this.sendNotification(tokens, noti);
    }

    // Notify host new booking
    static async notifyHostNewBooking(
        tokens: string[],
        name: string,
        bookingRef: string,
    ) {
        const noti = {
            title: 'New Booking Alert',
            body: `Room ${name} has new booking #${bookingRef}`,
        };
        await this.sendNotification(tokens, noti);
    }

    //Notify host booking update
    static async notifyHostUpdatedBooking(
        tokens: string[],
        bookingRef: string,
    ) {
        const noti = {
            title: 'Update Booking Alert',
            body: `Booking #${bookingRef} has been updated`,
        };
        await this.sendNotification(tokens, noti);
    }
    // Verify Check in Check out
    static async notifyClientCheckInOverTime(
        tokens: string[],
        bookingRef: string,
    ) {
        const noti = {
            title: 'Booking Overdue',
            body: `Your booking #${bookingRef} is canceled due to not check in.`,
        };
        await this.sendNotification(tokens, noti);
    }

    static async notifyHostCheckInOverTime(
        tokens: string[],
        bookingRef: string,
    ) {
        const noti = {
            title: 'Booking Overdue',
            body: `Booking #${bookingRef} is canceled due to not check in..`,
        };
        await this.sendNotification(tokens, noti);
    }

    static async notifyClientCheckOutOverTime(
        tokens: string[],
        bookingRef: string,
    ) {
        const noti = {
            title: 'Booking Overdue',
            body: `Your booking #${bookingRef} is marked as fail due to not check out.`,
        };
        await this.sendNotification(tokens, noti);
    }

    static async notifyHostCheckOutOverTime(
        tokens: string[],
        bookingRef: string,
    ) {
        const noti = {
            title: 'Booking Overdue',
            body: `Booking #${bookingRef} is failed due to user not check out.`,
        };
        await this.sendNotification(tokens, noti);
    }

    // Notify booking cancel
    static async notifyCancelBooking(tokens: string[], bookingRef: string) {
        const noti = {
            title: 'Booking Canceled',
            body: `Booking #${bookingRef} has been canceled`,
        };

        this.sendNotification(tokens, noti);
    }

    // Notify check in
    static async notifyClientCheckIn(
        tokens: string[],
        roomName: any,
        bookingRef: string,
    ) {
        const noti = {
            title: `Check in booking #${bookingRef}`,
            body: `Checked in at room ${roomName} successfully.`,
        };

        this.sendNotification(tokens, noti);
    }
    static async notifyHostCheckIn(
        tokens: string[],
        clientName: any,
        roomName: any,
        bookingRef: string,
    ) {
        const noti = {
            title: `Check in booking #${bookingRef}`,
            body: `${clientName} just checked in room ${roomName}`,
        };

        this.sendNotification(tokens, noti);
    }

    // Notify earn point for user after checkout
    static async notifyPoint(
        tokens: string[],
        point: number,
        bookingRef: string,
    ) {
        const noti = {
            title: `Check out #${bookingRef} successfully`,
            body: `Thank you for choosing our service. You've earned ${point} points`,
        };

        this.sendNotification(tokens, noti);
    }

    // Notify host check out successfully
    static async notifyHostCheckOut(
        tokens: string[],
        userName: any,
        bookingRef: string,
    ) {
        const noti = {
            title: `Booking #${bookingRef} check out.`,
            body: `${userName} checked out successfully.`,
        };

        this.sendNotification(tokens, noti);
    }
}
