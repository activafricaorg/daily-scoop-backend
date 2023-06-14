import express, { Request, Response } from "express";
const router = express.Router();
import ArticleModel from "../models/article.model";
import CategoryModel from "../models/category.model";

router.get("/", async (req: Request, res: Response): Promise<Response> => {
	// Get categories
	const result: any = await CategoryModel
		.find({}, null, {})
		.select({ "_id": 0, "__v": 0, "createdAt": 0, "updatedAt": 0})
		.lean()
		.exec();

	if (result) {
		const all = [];
		const categories: any = result;
		const per_page: any = req.query && req.query.count ? req.query.count : 5;
		const args = {limit: per_page, sort: {articleDate: -1}};

		for (const category of categories) {
			// Get articles that match that category
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


