import ogs from "open-graph-scraper";
import { slugifyText } from "../utils/helpers.util";
import Parser from "rss-parser";
import mongoose from "mongoose";
import { ArticleTypes } from "../types/article";
import ArticleModel from "../models/article.model";
import CategoryModel from "../models/category.model";
const config = require("../configs/db.configs");

// (async () => {
//
//
// })();

const importArticles = async () => {
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

	const categories = await CategoryModel
		.find({}, null, {})
		.select({ "_id": 0, "__v": 0})
		.populate('publishers')
		.exec();

	const articles: ArticleTypes[] = [];
	for (let category of categories) {
		for (let publisher of category.publishers) {
			const getRSS: Parser = new Parser();
			const feed = await getRSS.parseURL(`https://${publisher.feed}`);

			for (let item of feed.items) {
				if (item.link) {
					try {
						console.log(`Processing article -> ${item.link} from ${publisher.name}`);
						const { result } = await ogs({ url: item.link });

						if (result.success) {
							const lcCategories = item.categories?.map(category => {
								return category.toLowerCase();
							});

							articles.push({
								title: result.ogTitle,
								url: result.ogUrl,
								description: result.ogDescription,
								image: result.ogImage ? result.ogImage[0].url : undefined,
								source: publisher.name,
								guid: result.ogTitle ? slugifyText(result.ogTitle): undefined,
								category: category.name,
								country: publisher.country,
								tags: lcCategories,
								articleDate: item.isoDate
							});
						} else {
							continue;
						}

						if (
							feed.items.indexOf(item) == feed.items.length - 1
							&& (category.publishers).indexOf(publisher) == (category.publishers).length - 1
							&& categories.indexOf(category) == categories.length - 1
						) {
							ArticleModel.insertMany(articles, {ordered: false})
								.then(async() => {

								})
								.catch(async (err: Error) => {
									console.error(`Error adding article documents -> ${err}`);

									await mongoose.connection.close();
									console.log("Connection to MongoDB closed");
								});
						}
					} catch(err) {
						console.log(err);
					}
				}
			}
		}
	}
}

export default importArticles;