import express, { Request, Response } from "express";
import { ArticleTypes } from "../types/article";
const router = express.Router();
import ArticleModel from "../models/article.model";

router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const per_page: any = req.query && req.query.count ? req.query.count : 48;
	const page: any = req.query.page && req.query.page ? req.query.page : 1;
	const args = {limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 }};

	const result: ArticleTypes[] = await ArticleModel
		.find({}, null, args)
		.select({ "_id": 0, "__v": 0 })
		.lean()
		.exec();

	if (result && result.length > 0) return res.json(result);
	return res.status(404).json({
		status: "No record found"
	});
});

export default router;


