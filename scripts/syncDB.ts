require('../src/utils/env.util');
const fs = require("fs/promises");
const path = require("path");
import mongoose, {connection} from "mongoose";
const config = require("../src/configs/db.configs");

(async() => {
	try {
		// Connect the client to the server
		await mongoose.connect(`${config.uri}/`, { dbName: config.database });
		console.log("Connection to MongoDB started successful!");

		fs.readdir(path.resolve("./src/models"))
			.then((files: string[]) => {
				if (files.length != 0) {
					files
						.filter((file: string) => {
							return (file.indexOf(".") !== 0)
								&& (file.slice(-2) === "ts");
						})
						.forEach((file: string) => {
							const Model = require(path.join("../src/models/", file));
							Model.createCollection()
								.then(async () => {
									console.log(`${file.split(".")[0]} collection created`);

									// Check if we are in final iteration
									if (files.indexOf(file) == files.length - 1) {
										await mongoose.connection.close();
										console.log("Connection to MongoDB closed")
									}
								})
								.catch((err: Error) => {
									console.error(`Could not create collection -> ${err}`)
								});
						});
				} else {
					console.error(`Model directory is empty! -> ${files}`);
				}
			})
			.catch((err: Error) => {
				console.error(`Cannot read model directory: ${err}`)
			});
	} catch (error: Error | any) {
		console.error(`Unable to connect to database: ${error}`);
	}
})();