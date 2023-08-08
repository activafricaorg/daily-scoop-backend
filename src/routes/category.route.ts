import { CategoryTypes } from "../types/category";
import express, { Request, Response } from "express";
import CategoryModel from "../models/category.model";
import ArticleModel from "../models/article.model";
const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const filter: { title: string } | any = {};
	if (req.query.q) {
		const query = req.query.q;
		filter.slug = { $regex: query };
	}

	const result = await CategoryModel
		.find(filter, null, {})
		.select({ "_id": 0, "__v": 0})
		.exec();

	if ( result && result.length >= 1) return res.json(result);
	return res.status(404).json({
		status: "No record found"
	});
});

router.get("/:category", async (req: Request, res:Response): Promise<Response> => {
	const result = await CategoryModel
		.findOne({ slug: req.params.category }, null, {})
		.select({ "_id": 0, "__v": 0, "createdAt": 0, "updatedAt": 0})
		.lean()
		.exec();

	if (result && Object.keys(result).length > 0) {
		const category: CategoryTypes = result;
		const per_page: any = req.query && req.query.count ? req.query.count : 24;
		const page: any = req.query.page && req.query.page ? req.query.page : 1;
		const args = {limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 }};

		category.articles = await ArticleModel
			.find({category: result.name}, null, args)
			.select({"_id": 0, "__v": 0})
			.exec();

		return res.json(category);
	}

	return res.status(404).json({
		status: "No record found"
	});
});

export default router;
