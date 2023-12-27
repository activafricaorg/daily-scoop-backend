import express, { Request, Response } from "express";
import { ArticleTypes } from "../types/article";
import { TopicTypes } from "../types/topic";
const router = express.Router();
import ArticleModel from "../models/article.model";
import TopicModel from "../models/topic.model";

router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const topicFilter: any = {};
	const per_page: any = req.query && req.query.count ? req.query.count : 24;
	const page: any = req.query.page && req.query.page ? req.query.page : 1;
	const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleCount: -1 }};

	if (req.query.country) topicFilter.country = req.query.country;
	const result: TopicTypes[] | null = await TopicModel
		.find({
			$or: [
				topicFilter,
				{ country: 'all' },
			]
		}, null, args)
		.select({ "_id": 0, "__v": 0 })
		.lean()
		.exec();

	if (result && result.length > 0) return res.json(result);
	return res.status(404).json([]);
});

router.get("/:slug", async (req: Request, res: Response): Promise<Response> => {
	const per_page: any = req.query && req.query.count ? req.query.count : 24;
	const page: any = req.query && req.query.page ? req.query.page : 1;
	const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 }};

	const tagArray = (req.params.slug).split("-").join(" ");
	const result: ArticleTypes[] | null = await ArticleModel
		.find({tags: {$in: tagArray}}, null, args)
		.select({ "_id": 0, "__v": 0 })
		.lean()
		.exec();

	if (result) return res.json(result);
	return res.status(404).json([]);
});

export default router;


