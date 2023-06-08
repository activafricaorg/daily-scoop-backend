require("../src/utils/env.util");
const config = require("../src/configs/db.configs");
import Parser from "rss-parser";
import ogs from "open-graph-scraper";
import mongoose, {Types} from "mongoose";
import ArticleModel from "../src/models/article.model";
import CategoryModel from "../src/models/category.model";

// Interface representing a publisher (child documents) in MongoDB
interface IPublisher {
	_id: Types.ObjectId,
	name: string,
	url: string
}

// Interface representing a category (parent documents) in MongoDB
interface ICategory {
	name: string,
	slug: string,
	description: string,
	image: string,
	publishers: IPublisher[]
	createdAt: string,
	updatedAt: string
}

interface IArticle {
	title: string | undefined,
	url: string | undefined,
	image: string | undefined,
	category: string,
	tags: string[] | undefined
}

(async () => {
	const getRawArticles = async(categories: ICategory[]): Promise<IArticle[]> => {
		const articles: IArticle[] = [];
		for (const category of categories) {
			const getRSS: Parser = new Parser();
			category.publishers.map(async (publisher) => {
				const feed = await getRSS.parseURL(`https://${publisher.url}/rss`);
				(feed.items).map(async (item) => {
					if (item.link) {
						const { result } = await ogs({ url: item.link });
						if (result.success) {
							articles.push({
								title: result.ogTitle,
								url: result.ogUrl,
								image: result.ogImage ? result.ogImage[0].url : undefined,
								category: category.name,
								tags: item.categories
							});
						}
					}

				})
			});
		}

		return articles;
	}

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

	getRawArticles(categories)
		.then((result) => {
			// Check if we are in final iteration
			// console.log(feed.items.indexOf(item), feed.items.length - 1);
			// if (feed.items.indexOf(item) == feed.items.length - 1) {
			// 	ArticleModel.insertMany(articles)
			// 		.then(async() => {
			// 			console.log(`Successfully added bulk article documents to article collection`);
			//
			// 			await mongoose.connection.close();
			// 			console.log("Connection to MongoDB closed");
			// 		})
			// 		.catch((err: Error) => {
			// 			console.error(`Error adding bulk article documents -> ${err}`);
			// 		});
			// }
		});
})();