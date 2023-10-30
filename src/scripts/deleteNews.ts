import mongoose from "mongoose";
import moment from "moment";
import ArticleModel from "../models/article.model";
const config = require("../configs/db.configs");

const deleteNews = async () => {
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

	try {
		const older_than = moment().subtract(14, 'days').toDate();
		const { deletedCount } = await ArticleModel.find({ createdAt: { $lte: older_than } }).deleteMany().exec();

		console.log(`Successfully deleted ${deletedCount} stale news`);
	} catch(error: Error | any) {
		console.error('Unable to delete stale articles -> ', error);
		process.exit();
	}
}

export default deleteNews;