"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firebase = void 0;
const tslib_1 = require("tslib");
const admin = tslib_1.__importStar(require("firebase-admin"));
class Firebase {
    static async sendNotification(firebaseToken, noti) {
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
        }
        catch (err) {
            return { error: true, message: err.message };
        }
    }
    //Reminder Check in
    static async remindCheckInClient(tokens, bookingRef, before) {
        const noti = {
            title: 'Check In Remider',
            body: `Your booking #${bookingRef} is starting in ${before} minutes.`,
        };
        await this.sendNotification(tokens, noti);
    }
    static async remindCheckInHost(tokens, clientName, bookingRef, before) {
        const noti = {
            title: 'Check In Remider',
            body: `You have booking #${bookingRef} with ${clientName} in ${before} minutes`,
        };
        await this.sendNotification(tokens, noti);
    }
    //Reminder Check out
    static async remindCheckOutClient(tokens, bookingRef, before) {
        const noti = {
            title: 'Check Out Remider',
            body: `Your booking #${bookingRef} is ending in ${before} minutes.`,
        };
        await this.sendNotification(tokens, noti);
    }
    static async remindCheckOutHost(tokens, clientName, bookingRef, before) {
        const noti = {
            title: 'Check Out Remider',
            body: `Booking #${bookingRef} with ${clientName} is ending in ${before} minutes`,
        };
        await this.sendNotification(tokens, noti);
    }
    static async notifyHostNewBooking(tokens, name, bookingRef) {
        const noti = {
            title: 'New Booking Alert',
            body: `Room ${name} has new booking #${bookingRef}`,
        };
        await this.sendNotification(tokens, noti);
    }
    // Verify Check in Check out
    static async notifyClientCheckInOverTime(tokens, bookingRef) {
        const noti = {
            title: 'Booking Overdue',
            body: `Your booking #${bookingRef} is canceled due to overtime.`,
        };
        await this.sendNotification(tokens, noti);
    }
    static async notifyHostCheckInOverTime(tokens, bookingRef) {
        const noti = {
            title: 'Booking Overdue',
            body: `Booking #${bookingRef} is canceled due to overtime.`,
        };
        await this.sendNotification(tokens, noti);
    }
    static async notifyClientCheckOutOverTime(tokens, bookingRef) {
        const noti = {
            title: 'Booking Overdue',
            body: `Your booking #${bookingRef} is maarked as fail due to not check out.`,
        };
        await this.sendNotification(tokens, noti);
    }
    static async notifyHostCheckOutOverTime(tokens, bookingRef) {
        const noti = {
            title: 'Booking Overdue',
            body: `Booking #${bookingRef} is failed due to user not check out.`,
        };
        await this.sendNotification(tokens, noti);
    }
}
exports.Firebase = Firebase;
//# sourceMappingURL=firebase.service.js.map