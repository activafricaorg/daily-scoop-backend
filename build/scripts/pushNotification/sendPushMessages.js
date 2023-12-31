"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_model_1 = __importDefault(require("../../models/token.model"));
const expo_server_sdk_1 = require("expo-server-sdk");
// initialize Expo
let expo = new expo_server_sdk_1.Expo({ accessToken: "w7KHALZRy3a9XHmv2U-UUWy6XewLaqJ7oT5Vi8X1" });
const sendPushMessages = async (title, body, data) => {
    // Get tokens data from Token collection
    const rawTokens = await token_model_1.default.find().select({ 'fcmToken': 1, '_id': 0 });
    // Filter out fcmTokens
    const tokens = ["ExponentPushToken[Gn59GFEMviULScGMogyQaL]"];
    // rawTokens.forEach((token) => tokens.push(token.fcmToken));
    // Create the messages that you want to send to clients
    let messages = [];
    for (let pushToken of tokens) {
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!expo_server_sdk_1.Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messages.push({
            to: pushToken,
            sound: 'default',
            title: title,
            body: body,
            data: data,
        });
    }
    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.default = sendPushMessages;
