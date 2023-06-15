import {CategoryTypes} from "../src/types/category";

require("../src/utils/env.util");
import fs from "fs/promises";
import mongoose from "mongoose";
const config = require("../src/configs/db.configs");
import CategoryModel from "../src/models/category.model";

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

	fs.readFile("./categories.json", "utf-8")
		.then(async (categoriesJSON: string) => {
			const categories: CategoryTypes[] = JSON.parse(categoriesJSON);
			CategoryModel.insertMany(categories)
				.then(async() => {
					console.log(`Successfully added bulk category document to category collection`);

					await mongoose.connection.close();
					console.log("Connection to MongoDB closed");
				})
				.catch((err: Error) => {
					console.error(`Error adding bulk category documents -> ${err}`);
				});
		});
})();