require("../src/utils/env.util");
const config = require("../src/configs/db.configs");
import fs from "fs/promises";
import mongoose from "mongoose";
import CategoryModel from "../src/models/category.model";

interface IRawPublisher {
	name: string,
	url: string
}

interface IRawCategory {
	name: string,
	slug: string,
	description: string,
	image: string
	publishers: IRawPublisher[]
}

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
			const categories: IRawCategory[] = JSON.parse(categoriesJSON);
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