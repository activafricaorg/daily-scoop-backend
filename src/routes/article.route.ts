import express, { Request, Response } from "express";
import { ArticleTypes } from "../types/article";
const router = express.Router();
import ArticleModel from "../models/article.model";

router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const per_page: any = req.query && req.query.count ? req.query.count : 24;
	const page: any = req.query.page && req.query.page ? req.query.page : 1;
	const args = {limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 }};
	let filter = {};

	if (req.query.search && typeof req.query.search === 'string') {
		const searchArray = (req.query.search).split(" ");
		filter = { title: new RegExp(`${searchArray[0]} ${searchArray[1]} ${searchArray[2]}`, 'i') };
	}

	const result: ArticleTypes[] = await ArticleModel
		.find(filter, null, args)
		.select({ "_id": 0, "__v": 0 })
		.lean()
		.exec();

	if (result && result.length > 0) {
		if (req.query.search && typeof req.query.search === 'string') {
			result[0].related = await ArticleModel
				.find({category: result[0].category}, null, args)
				.select({"_id": 0, "__v": 0})
				.exec();

			return res.json(result[0]);
		}

		return res.json(result);
	}

	return res.status(404).json({
		status: "No record found"
	});
});

router.get("/:guid", async (req: Request, res: Response): Promise<Response> => {
	const per_page: any = req.query && req.query.count ? req.query.count : 24;
	const page: any = req.query.page && req.query.page ? req.query.page : 1;
	const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 }};

	const result: ArticleTypes | null = await ArticleModel
		.findOne({ guid: req.params.guid }, null, args)
		.select({ "_id": 0, "__v": 0 })
		.lean()
		.exec();

	if (result) {
		result.related = await ArticleModel
			.find({category: result.category}, null, args)
			.select({"_id": 0, "__v": 0})
			.exec();

		return res.json(result);
	}

	return res.status(404).json({
		status: "No record found"
	});
});

export default router;


