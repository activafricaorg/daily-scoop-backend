import Parser from "rss-parser";
import { ArticleTypes } from "../types/article";
import { CategoryTypes } from "../types/category";
import { slugifyText } from "../utils/helpers.util";
import ArticleModel from "../models/article.model";
import CategoryModel from "../models/category.model";

const importArticles = async () => {
	const promises: any[] = [];
	const articles: ArticleTypes[] = [];
	const categories: CategoryTypes[] = await CategoryModel
		.find({}, null, {})
		.select({ "_id": 0, "__v": 0})
		.populate('publishers')
		.exec();

	categories.filter(category => category.name !== 'tech')
		.forEach((category: CategoryTypes) => {
			for (let publisher of category.publishers) {
				promises.push(
					new Promise(async (resolve, reject) => {
						try {
							const getRSS: Parser = new Parser();
							const feed = await getRSS.parseURL(`https://${publisher.feed}`);

							resolve({
								category: category,
								publisher: publisher,
								feed: feed
							});
						} catch (error) {
							reject(error);
						}
					})
				);
			}
		});


	Promise.allSettled(promises)
		.then(results => {
			results.forEach((result) => {
				if (result.status === 'fulfilled') {
					const value = result.value;
					for (let item of value.feed.items) {
						const categories: string[] = item.categories;
						const lcCategories = categories.map(category => category.toLowerCase());

						console.log(`Processed article: ${item.link} from ${value.publisher.name}`);
						articles.push({
							title: item.title,
							url: item.url,
							description: undefined,
							image: undefined,
							source: value.publisher.name,
							guid: item.title ? slugifyText(item.title): undefined,
							category: value.category.name,
							country: value.publisher.country,
							tags: lcCategories,
							articleDate: item.isoDate
						});
					}
				}
			})
		})
		.then(() => {
			ArticleModel.insertMany(articles, { ordered: false })
				.then(() => {
					console.error(`All scrapped articles added`);
				})
				.catch((err: Error) => {
					console.error(`Error adding article documents -> ${err}`);
				});
		});
}

export default importArticles;