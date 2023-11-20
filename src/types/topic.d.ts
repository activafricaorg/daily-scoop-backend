import { Types } from "mongoose";

export type TopicTypes = {
	_id?: Types.ObjectId,
	name: string,
	country: string,
	image: string | undefined,
	articleCount: number | undefined,
	createdAt?: string | undefined,
	updatedAt?: string | undefined
}