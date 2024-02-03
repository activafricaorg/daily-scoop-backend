import "./utils/env.util";
import express, { Express } from "express";
import mongoose from "mongoose";
import cron from 'node-cron';
import bodyParser from "body-parser";
import cors from 'cors';
import deleteNews from "./scripts/deleteNews";
import importArticles from "./scripts/importArticles";
import article from "./routes/article.route";
import category from "./routes/category.route";
import publisher from "./routes/publisher.route";
import topic from "./routes/topic.route";
import token from "./routes/token.route";
import pushNotification from "./routes/pushNotification.route";
import sortTopics from "./scripts/sortTopics";
import DailyPushNotification from "./scripts/pushNotification/schedule/daily";
const config = require("./configs/db.configs");

// Express
const app: Express = express();
const port = process.env.PORT || 4001;

// Cors
app.use(cors());

// Incoming request body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use("/article", article);
app.use("/category", category);
app.use("/publisher", publisher);
app.use("/topic", topic);
app.use("/token", token);
app.use("/pushNotification", pushNotification);

app.get('/', (req, res) => {
	res.json({
		message: 'ok',
	});
});

(async() => {
	try {
		// Connect the client to the server
		await mongoose.connect(`${config.uri}/`, { dbName: config.database });
		console.log("Connection to MongoDB started successfully!");

		// Start application
		app.listen(port, () => {
			console.log(`Daily scoop web service currently running on port ${port}`);
		});

		// 1. Cron job to get articles every 3 hours
		cron.schedule('0 */1 * * *', async () => {
			await importArticles();
		});

		// 2. Cron job to delete stale articles every 12 hours
		cron.schedule('0 */12 * * *', async () => {
			await deleteNews();
		});

		// 3. Cron job to re-compile topics every 25 minutes
		cron.schedule('*/25 * * * *', async () => {
			await sortTopics();
		});

		// 4. Daily Push Notifications
		// await DailyPushNotification();

		// await sendPushMessages("Good morning sunshine 🌞", "Here are your early morning news from your daily news platforms.", { route: "Feed", params: {screen: 'News' }});
		// await sendPushMessages("Morning News 🌞", "Before you start your day, catchup on the morning news from your favourite news sources.", { route: "Feed", params: { screen: 'News' }});

		// Create token collection
		// TokenModel.createCollection().then(function (collection) {
		// 	console.log('Token Collection is created!');
		// });

	} catch (error: Error | any) {
		console.error('Unable to connect to database -> ', error);
	}
})();