import "../utils/env.util";
import fs from "fs/promises";
import mongoose from "mongoose";
import { CategoryTypes } from "../types/category";
import CategoryModel from "../models/category.model";
const config = require("../configs/db.configs");

(async () => {
	if (mongoose.connection.readyState == 0) {
		try {
			// Connect the client to the server
			mongoose.connect(`${config.uri}/`, { dbName: config.database })
			.then(async () => {
				await CategoryModel.deleteMany({});

				fs.readFile("./categories.json", "utf-8")
					.then(async (categoriesJSON: string) => {
						const categories: CategoryTypes[] = JSON.parse(categoriesJSON);
						console.log(categories);
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
			})
		} catch (error: Error | any) {
			console.error('Unable to connect to database -> ', error);
			process.exit();
		}
	}
})();