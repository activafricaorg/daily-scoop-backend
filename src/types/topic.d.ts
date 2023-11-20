import { Types } from "mongoose";

export type TopicTypes = {
	_id?: Types.ObjectId,
	name: string,
	country: string,
	articleCount: number | undefined,
	createdAt?: string | undefined,
	updatedAt?: string | undefined
}