import { Types } from "mongoose";

export type ArticleTypes = {
	_id?: Types.ObjectId,
	title: string | undefined,
	url: string | undefined,
	image: string | undefined,
	source: string,
	guid: string | undefined,
	description: string | undefined,
	related?: ArticleTypes[],
	category: string,
	country: string | null,
	articleDate: string | undefined,
	tags: string[],
	createdAt?: string | undefined,
	updatedAt?: string | undefined
}