import express, { Request, Response } from "express";
import ArticleModel from "../models/article.model";
const router = express.Router();

// GET all articles that matches a criteria in the query parameter
router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const filter: { title: string } | any = {};
	const per_page: any = req.query && req.query.count ? req.query.count : 24;
	const page: any = req.query.page ? req.query.page : 1;
	const args = {
		limit: per_page,
		skip: per_page * (page - 1),
		sort: { updatedAt: -1 }
	};

	if (req.query.q) {
		const query = req.query.q;
		filter.title = { $regex: query };
	}

	const result = await ArticleModel.find(filter, null, args).exec();
	return res.json(result);
});

export default router;


