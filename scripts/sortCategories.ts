import path from "path";

require("../src/utils/env.util");
import mongoose from "mongoose";
import fs from "fs/promises";
const config = require("../src/configs/db.configs");

(async () => {
	if (mongoose.connection.readyState == 0) {
		try {
			// Connect the client to the server
			await mongoose.connect(`${config.uri}/`, { dbName: config.database });
			console.log("Connection to MongoDB started successfully!");
		} catch (error: Error | any) {
			console.error('Unable to connect to database -> ', error);
			process.exit();
		}
	}

	const categories = await fs.readFile("./categories.json", "utf-8");
	console.log(categories);
})()