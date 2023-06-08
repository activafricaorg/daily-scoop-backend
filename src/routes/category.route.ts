import express, {Request, Response} from "express";
const router = express.Router();
import CategoryModel from "../models/category.model";
import ArticleModel from "../models/article.model";

// GET all articles that matches a criteria in the query parameter
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

	return res.json(result);
});

router.get("/:category", async (req: Request, res:Response): Promise<Response> => {
	// Get categories
	const result = await CategoryModel
		.findOne({ slug: req.params.category }, null, {})
		.select({ "_id": 0, "__v": 0, "createdAt": 0, "updatedAt": 0})
		.lean()
		.exec();

	if (result) {
		const category: any = result;

		// Get articles that match that category
		 category.articles = await ArticleModel
			.find({category: result.name}, null, {})
			.select({"_id": 0, "__v": 0})
			.exec();

		return res.json(category);
	}

	return res.status(404).json({
		status: "No record found"
	});
});

export default router;
