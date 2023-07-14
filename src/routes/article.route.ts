import {CategoryTypes} from "../types/category";
import express, { Request, Response } from "express";
const router = express.Router();
import ArticleModel from "../models/article.model";
import CategoryModel from "../models/category.model";

router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const result: any = await CategoryModel
		.find({}, null, {})
		.select({ "_id": 0, "__v": 0, "createdAt": 0, "updatedAt": 0})
		.lean()
		.exec();

	if (result) {
		const all: CategoryTypes[] = [];
		const categories: CategoryTypes[] = result;
		const per_page: any = req.query && req.query.count ? req.query.count : 48;
		const args = {limit: per_page, sort: {articleDate: -1}};

		for (const category of categories) {
			category.articles = await ArticleModel
				.find({category: category.name}, null, args)
				.select({"_id": 0, "__v": 0})
				.exec();

			all.push(category);
		}

		return res.json(all);
	}

	return res.status(404).json({
		status: "No record found"
	});
});

export default router;


