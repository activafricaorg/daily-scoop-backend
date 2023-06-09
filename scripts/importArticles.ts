require("../src/utils/env.util");
import ogs from "open-graph-scraper";
import Parser from "rss-parser";
import mongoose from "mongoose";
const config = require("../src/configs/db.configs");
import ArticleModel from "../src/models/article.model";
import CategoryModel from "../src/models/category.model";

interface IArticle {
	title: string | undefined,
	url: string | undefined,
	image: string | undefined,
	source: string,
	sourceImage: string
	category: string,
	tags: string[] | undefined
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

	const categories = await CategoryModel
		.find({}, null, {})
		.select({ "_id": 0, "__v": 0})
		.populate('publishers')
		.exec();

	const articles: IArticle[] = [];
	for (let category of categories) {
		for (let publisher of category.publishers) {
			const getRSS: Parser = new Parser();
			const feed = await getRSS.parseURL(`https://${publisher.url}/rss`);

			for (let item of feed.items) {
				if (item.link) {
					console.log(`Processing article -> ${item.link} from ${publisher.name}`);
					const { result } = await ogs({ url: item.link });

					if (result.success) {
						articles.push({
							title: result.ogTitle,
							url: result.ogUrl,
							image: result.ogImage ? result.ogImage[0].url : undefined,
							source: publisher.name,
							sourceImage: publisher.image,
							category: category.name,
							tags: item.categories
						});
					}

					if (
						feed.items.indexOf(item) == feed.items.length - 1
						&& (category.publishers).indexOf(publisher) == (category.publishers).length - 1
						&& categories.indexOf(category) == categories.length - 1
					) {
						ArticleModel.insertMany(articles)
							.then(async() => {
								console.log(`Successfully added available article documents`);

								await mongoose.connection.close();
								console.log("Connection to MongoDB closed");
							})
							.catch(async (err: Error) => {
								console.error(`Error adding article documents -> ${err}`);

								await mongoose.connection.close();
								console.log("Connection to MongoDB closed");
							});
					}
				}
			}
		}
	}
})();