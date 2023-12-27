import express, { Request, Response } from "express";
import { TokenTypes } from "../types/token";
const router = express.Router();
import TokenModel from "../models/token.model";

router.get("/", async(req: Request, res: Response): Promise<Response> => {
	const result: TokenTypes[] | null = await TokenModel.find({});

	if (result && result.length > 0) return res.json(result);
	return res.status(404).json([]);
});

router.get("/:applicationId", async(req: Request, res: Response): Promise<Response> => {
	const { applicationId } = req.params;
	const result: TokenTypes[] | null = await TokenModel.findOne({ applicationId });

	if (result && result.length > 0) return res.json(result);
	return res.status(404).json([]);
});

router.post("/", async(req: Request, res: Response): Promise<Response | undefined> => {
	const { applicationId, fcmToken } = req.body;

	try {
		const result = await TokenModel.create({
			applicationId: applicationId,
			fcmToken: fcmToken
		});

		return res.json(result);
	} catch (err) {
		res.status(422).send(err);
		console.log(err);
	}
});

router.put("/:applicationId", async(req: Request, res: Response) => {
	const { applicationId } = req.params;
	const { fcmToken } = req.body;

	try {
		const result = await TokenModel.updateOne(
			{ applicationId },
			{ fcmToken }
		);

		return res.json(result);
	} catch (err) {
		res.status(422).send(err);
		console.log(err);
	}
});

export default router;