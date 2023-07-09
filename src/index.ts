require('./utils/env.util.ts');
import express, { Express } from "express";
import mongoose from "mongoose";
import article from "../src/routes/article.route";
import category from "../src/routes/category.route";
import publisher from "../src/routes/publisher.route";
const config = require("../src/configs/db.configs");

// Express
const app: Express = express();
const port = process.env.PORT || 4001;

// Routes
app.use("/article", article);
app.use("/category", category);
app.use("/publisher", publisher);

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