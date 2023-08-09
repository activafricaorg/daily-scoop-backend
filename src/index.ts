import "./utils/env.util";
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from 'cors';
import article from "./routes/article.route";
import category from "./routes/category.route";
import publisher from "./routes/publisher.route";
import topic from "./routes/topic.route";
const config = require("./configs/db.configs");

// Express
const app: Express = express();
const port = process.env.PORT || 4001;

// Cors
app.use(cors({
	origin: '*'
}));

// Routes
app.use("/article", article);
app.use("/category", category);
app.use("/publisher", publisher);
app.use("/topic", topic);

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
		})
	} catch (error: Error | any) {
		console.error('Unable to connect to database -> ', error);
	}
})();