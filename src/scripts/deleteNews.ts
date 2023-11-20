import moment from "moment";
import ArticleModel from "../models/article.model";

const deleteNews = () => {
	const promise = new Promise(async (resolve, reject) => {
		const older_than = moment().subtract(14, 'days').toDate();
		const { deletedCount } = await ArticleModel.find({createdAt: {$lte: older_than}}).deleteMany().exec();

		if (deletedCount) resolve(deletedCount);
		reject(new Error(`Unable to delete stale articles`));
	});

	promise.then (
		result => { console.log(`Successfully deleted ${result} stale news`) },
		error => { console.log(error) }
	);
};

export default deleteNews;