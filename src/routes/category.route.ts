import express, { Request, Response } from "express";
import CategoryModel from "../models/category.model";
const router = express.Router();

// GET all articles that matches a criteria in the query parameter
router.get("/", async (req: Request, res: Response): Promise<Response> => {
	const filter: { title: string } | any = {};
	if (req.query.q) {
		const query = req.query.q;
		filter.slug = { $regex: query };
	}

	const result = await CategoryModel.find(filter, null, {}).exec();
	return res.json(result);
});

export default router;
