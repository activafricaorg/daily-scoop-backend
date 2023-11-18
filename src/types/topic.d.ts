import { Types } from "mongoose";

export type TopicTypes = {
	_id?: Types.ObjectId,
	name: string,
	url: string | undefined,
	articleCount: number | undefined,
	createdAt?: string | undefined,
	updatedAt?: string | undefined
}