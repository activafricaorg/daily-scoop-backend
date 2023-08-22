import { Types } from "mongoose";

export type JobTypes = {
	_id?: Types.ObjectId,
	title: string,
	url: string,
	source: string,
	employer: string,
	location: string,
	country: string,
	attributes: string[],
	createdAt: string,
	updatedAt: string
}