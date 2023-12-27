"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_model_1 = __importDefault(require("../../models/token.model"));
const firebase_admin_1 = require("firebase-admin");
// initialize Firebase
const FCM = (0, firebase_admin_1.initializeApp)({
// credential: applicationDefault()
});
const sendPushMessages = async () => {
    // Get tokens from Token collection
    const tokens = await token_model_1.default.find().select({ "fcmToken": 1, "_id": 0, "_v": 0, "createAt": 0, }).lean();
    // Send message to subscribed devices
    await FCM.messaging().sendEachForMulticast({
        tokens,
        data: { hello: 'world!' },
    });
};
exports.default = sendPushMessages();
