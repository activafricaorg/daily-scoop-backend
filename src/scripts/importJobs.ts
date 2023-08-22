import fs from "fs/promises";
import mongoose from "mongoose";
import axios from 'axios';
import * as cheerio from 'cheerio';
import Jobs from "../models/job.model";
const config = require("../configs/db.configs");

type jobSourceType = {
	name: string,
	base: string,
	country: string,
	selectors: {
		jobItem: string,
		jobItemTitle: string,
		jobItemLink: string,
		jobItemEmployer: string,
		jobLocation: string,
		jobAttributes: string
	}
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

	const processListing = async (jobSources: jobSourceType[]) => {}
})();