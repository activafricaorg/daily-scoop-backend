import { ArticleTypes } from "../types/article";
import ArticleModel from "../models/article.model";
import TopicModel from "../models/topic.model";

const sortTopics = async () => {
	await TopicModel.deleteMany({});

	const articles: ArticleTypes[] | null = await ArticleModel
		.find({}, null, {})
		.select({ "_id": 0, "__v": 0 })
		.lean()
		.exec();

	if (articles) {
		let topics: { name: string, country: string | null, articleCount: number }[] = [];

		for (let article of articles) {
			for (let tag of article.tags) {
				let found = topics.find(topic => topic.name === tag);
				let temp: { name: string, country: string | null, articleCount: number }[] = [];

				if (found) {
					let index = topics.findIndex((topic => topic.name === tag));
					topics[index].articleCount++;
				} else {
					temp.push({
						name: tag,
						country: article.country,
						articleCount: 1
					});
				}

				topics = topics.concat(temp);
			}
		}

		TopicModel.insertMany(topics, { ordered: false })
			.then((result) => {
				console.log(`Topics updated!`);
			})
			.catch((err: Error) => {
				console.error(`Error setting up topics -> ${err}`);
			});

		// console.log(topics);
	}
}

export default sortTopics;