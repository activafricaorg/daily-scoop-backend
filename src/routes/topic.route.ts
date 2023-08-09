import express, { Request, Response } from "express";
import { ArticleTypes } from "../types/article";
const router = express.Router();
import ArticleModel from "../models/article.model";

router.get("/:slug", async (req: Request, res: Response): Promise<Response> => {
	const per_page: any = req.query && req.query.count ? req.query.count : 24;
	const page: any = req.query.page && req.query.page ? req.query.page : 1;
	const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 }};

	let filter = {};
	const tagArray = (req.params.slug).split("-").join(" ");
	filter = {tags: {$in: tagArray}};

	const result: ArticleTypes[] | null = await ArticleModel
		.find(filter, null, args)
		.select({ "_id": 0, "__v": 0 })
		.lean()
		.exec();

	if (result) {
		return res.json(result);
	}

	return res.status(404).json({
		status: "No record found"
	});
});

export default router;


