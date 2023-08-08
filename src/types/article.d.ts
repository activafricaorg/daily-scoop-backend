import {Types} from "mongoose";

export type ArticleTypes = {
	_id?: Types.ObjectId,
	title: string | undefined,
	url: string | undefined,
	image: string | undefined,
	source: string,
	description: string | undefined,
	related?: ArticleTypes[],
	sourceImage: string,
	category: string,
	articleDate: string | undefined,
	tags: string[] | undefined,
	createdAt?: string | undefined,
	updatedAt?: string | undefined
}