import { Types } from "mongoose";

export type TokenTypes = {
	_id?: Types.ObjectId,
	applicationId: string,
	fcmToken: string,
	createdAt?: string | undefined,
	updatedAt?: string | undefined
}