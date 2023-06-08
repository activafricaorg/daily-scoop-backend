import express, { Request, Response } from "express";
import CategoryModel from "../models/category.model";
import ArticleModel from "../models/article.model";
const router = express.Router();

// GET all publishers that matches a criteria in the query parameter
router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const result = await CategoryModel
		.find({}, null, {})
		.select({ "_id": 0, "__v": 0})
		.lean()
		.exec();

	let publishers: any[] = [];
	result.forEach((category) => {
		publishers = publishers.concat(category.publishers);
	});

	if (req.query.search) {
		let matchedPublisher = publishers
			.filter((publisher) => {
				return publisher.name == req.query.search;
			});

		if (matchedPublisher) {
			matchedPublisher[0].articles = await ArticleModel
				.find({source: matchedPublisher[0].name}, null, {})
				.select({"_id": 0, "__v": 0})
				.exec();

			return res.json(matchedPublisher[0]);
		}

		return res.status(404).json({
			status: "No record found"
		});
	}

	if (publishers.length >= 1) return res.json(publishers);
	return res.status(404).json({
		status: "No record found"
	});
});

export default router;