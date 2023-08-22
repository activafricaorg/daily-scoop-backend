import fs from "fs/promises";
import mongoose from "mongoose";
import Jobs from "../models/job.model";
import { Indeed } from "../utils/scrapper.util";
const config = require("../configs/db.configs");

type jobSourceType = {
	name: string,
	baseURL: string,
	country: string,
	countryCode: string,
	locations: string[]
}

(async () => {
	if (mongoose.connection.readyState == 0) {
		try {
			// Connect the client to the server
			await mongoose.connect(`${config.uri}/`, { dbName: config.database });
			console.log("Connection to MongoDB started successfully");

			const collections = await mongoose.connection.db.listCollections({name: 'jobs'}).toArray();
			if (collections.length < 1) await Jobs.createCollection();

			fs.readFile("./jobs.json", "utf-8")
				.then(async (sourceJSON: string) => {
					const jobSources: jobSourceType[] = JSON.parse(sourceJSON);
					await processListing(jobSources);
				});
		} catch (error: Error | any) {
			console.error("Unable to connect to database -> ", error);
			process.exit();
		}
	}

	const processListing = async (jobSources: jobSourceType[]) => {
		jobSources.map((jobSource: jobSourceType) => {
			const scrapper = new Indeed();
			scrapper.scrape(jobSource.locations, 10);
		});
	}
})();