require('./utils/env.util.ts');
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import articleRouter from "../src/routes/article.route";
import categoryRouter from "../src/routes/category.route";
const config = require("../src/configs/db.configs");

// Express
const app: Express = express();
const port = process.env.PORT || 4001;

// Routes
app.use("/articles", articleRouter);
app.use("/categories", categoryRouter);

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