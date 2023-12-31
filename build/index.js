"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./utils/env.util");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_cron_1 = __importDefault(require("node-cron"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const deleteNews_1 = __importDefault(require("./scripts/deleteNews"));
const importArticles_1 = __importDefault(require("./scripts/importArticles"));
const article_route_1 = __importDefault(require("./routes/article.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const publisher_route_1 = __importDefault(require("./routes/publisher.route"));
const topic_route_1 = __importDefault(require("./routes/topic.route"));
const token_route_1 = __importDefault(require("./routes/token.route"));
const sortTopics_1 = __importDefault(require("./scripts/sortTopics"));
const config = require("./configs/db.configs");
// Express
const app = (0, express_1.default)();
const port = process.env.PORT || 4001;
// Cors
app.use((0, cors_1.default)());
// Incoming request body parser
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
app.use("/article", article_route_1.default);
app.use("/category", category_route_1.default);
app.use("/publisher", publisher_route_1.default);
app.use("/topic", topic_route_1.default);
app.use("/token", token_route_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'ok',
    });
});
(async () => {
    try {
        // Connect the client to the server
        await mongoose_1.default.connect(`${config.uri}/`, { dbName: config.database });
        console.log("Connection to MongoDB started successfully!");
        // Start application
        app.listen(port, () => {
            console.log(`Daily scoop web service currently running on port ${port}`);
        });
        // 1. Cron job to get articles every 3 hours
        node_cron_1.default.schedule('0 */1 * * *', async () => {
            await (0, importArticles_1.default)();
        });
        // 2. Cron job to delete stale articles every 12 hours
        node_cron_1.default.schedule('0 */12 * * *', async () => {
            await (0, deleteNews_1.default)();
        });
        // 3. Cron job to re-compile topics every 25 minutes
        node_cron_1.default.schedule('*/25 * * * *', async () => {
            await (0, sortTopics_1.default)();
        });
        // 4. Daily Push Notifications
        // await DailyPushNotification();
        // await sendPushMessages("Good morning sunshine 🌞", "Here are your early morning news from your daily news platforms.", { route: "Feed", params: {screen: 'News' }});
        // await sendPushMessages("Morning News 🌞", "Before you start your day, catchup on the morning news from your favourite news sources.", { route: "Feed", params: { screen: 'News' }});
        // Create token collection
        // TokenModel.createCollection().then(function (collection) {
        // 	console.log('Token Collection is created!');
        // });
    }
    catch (error) {
        console.error('Unable to connect to database -> ', error);
    }
})();
