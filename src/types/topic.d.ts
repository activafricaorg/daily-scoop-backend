import { Types } from "mongoose";

export type TopicTypes = {
	_id?: Types.ObjectId,
	name: string,
	country: string,
	articleCount: number,
	createdAt?: string | undefined,
	updatedAt?: string | undefined
}