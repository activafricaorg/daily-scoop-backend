"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const sendPushMessages_1 = __importDefault(require("../sendPushMessages"));
const DailyPushNotification = async () => {
    // 1. Cron job every day at 9am
    node_cron_1.default.schedule('0 8 * * *', async () => {
        await (0, sendPushMessages_1.default)("Morning News 🌞", "Before you start your day, catchup on the morning news from your favourite news sources.", { route: "Feed", params: { screen: 'News' } });
    });
    // 2. Cron job every day at 3pm
    node_cron_1.default.schedule('0 14 * * *', async () => {
        await (0, sendPushMessages_1.default)("Afternoon News ☀️", "A lot has happened since the morning news, check out more news from popular news sources.", { route: "Feed", params: { screen: 'News' } });
        // await importArticles();
    });
    // 3. Cron job every day at 9pm
    node_cron_1.default.schedule('0 20 * * *', async () => {
        await (0, sendPushMessages_1.default)("Evening News 🌙", "It's the end of the day, check out more news from popular news sources", { route: "Feed", params: { screen: 'News' } });
    });
};
exports.default = DailyPushNotification;
