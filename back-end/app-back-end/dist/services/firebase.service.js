"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firebase = void 0;
const tslib_1 = require("tslib");
const admin = tslib_1.__importStar(require("firebase-admin"));
class Firebase {
    static async sendNotification(firebaseToken, noti) {
        try {
            const message = {
                notification: noti,
                token: firebaseToken,
            };
            const result = await admin.messaging().send(message);
            return result;
        }
        catch (err) {
            return { error: true, message: err.message };
        }
    }
}
exports.Firebase = Firebase;
//# sourceMappingURL=firebase.service.js.map