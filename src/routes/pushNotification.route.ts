import express, { Request, Response } from "express";
import sendPushMessages from "../scripts/pushNotification/sendPushMessages";

const router = express.Router();

router.post("/", async(req: Request, res: Response): Promise<Response | undefined> => {
	try {
		const { title, body, data } = req.body;
		const tickets = await sendPushMessages ( title, body, data);
		return res.json(tickets);
	} catch (err) {
		res.status(422).send(err);
		console.log(err);
	}
});

export default router;