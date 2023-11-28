import express, { Request, Response } from "express";
import { ArticleTypes } from "../types/article";
const router = express.Router();
import ArticleModel from "../models/article.model";

router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const articleFilter: any = {};
	const per_page: any = req.query && req.query.count ? req.query.count : 24;
	const page: any = req.query.page && req.query.page ? req.query.page : 1;
	const args = {limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 }};

	if (req.query.country) articleFilter.country = req.query.country;
	const result: ArticleTypes[] | [] = await ArticleModel
		.find({
			$or: [
				articleFilter,
				{ country: 'all' },
			]
		}, null, args)
		.select({ "_id": 0, "__v": 0 })
		.lean()
		.exec();

	if (result && result.length > 0) return res.json(result);
	return res.status(404).json([]);
});

router.get("/all", async (req: Request, res: Response): Promise<Response> => {
	const result: ArticleTypes[] | null = await ArticleModel
		.find({}, null, {})
		.select({ "_id": 0, "__v": 0 })
		.lean()
		.exec();

	if (result && result.length > 0) return res.json(result);
	return res.status(404).json([]);
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
			.find({ category: result.category }, null, args)
			.where("guid").ne(req.params.guid)
			.select({"_id": 0, "__v": 0})
			.exec();

		return res.json(result);
	}

	return res.status(404).json([]);
});

export default router;


