import { PublisherTypes } from "../types/publisher";
import { CategoryTypes } from "../types/category";
import express, { Request, Response } from "express";
import CategoryModel from "../models/category.model";
import ArticleModel from "../models/article.model";
const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const result: CategoryTypes[] = await CategoryModel
		.find({}, null, {})
		.select({ "_id": 0, "__v": 0})
		.lean()
		.exec();

	let publishers: PublisherTypes[] = [];
	result.forEach((category) => {
		publishers = publishers.concat(category.publishers);
	});

	if (req.query.search) {
		let matchedPublisher: PublisherTypes[] = publishers
			.filter((publisher) => {
				return publisher.name == req.query.search;
			});

		if (matchedPublisher && matchedPublisher.length > 0) {
			const all: PublisherTypes[] = [];
			const publishers: PublisherTypes[] = matchedPublisher;
			const per_page: any = req.query && req.query.count ? req.query.count : 24;
			const page: any = req.query.page && req.query.page ? req.query.page : 1;
			const args = {limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 }};

			for (const publisher of publishers) {
				publisher.articles = await ArticleModel
					.find({source: matchedPublisher[0].name}, null, args)
					.select({"_id": 0, "__v": 0})
					.lean()
					.exec();

				all.push(publisher);
			}

			return res.json(all);
		}

		return res.status(404).json({
			status: "No record found"
		});
	}

	if (publishers && publishers.length > 0) return res.json(publishers);
	return res.status(404).json({
		status: "No record found"
	});
});

export default router;