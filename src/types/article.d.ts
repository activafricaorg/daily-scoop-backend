import {Types} from "mongoose";

export type ArticleTypes = {
	_id: Types.ObjectId,
	title: string,
	url: string,
	image: string,
	source: string,
	description: string,
	sourceImage: string,
	category: string,
	articleDate: string,
	tags: Types.Array<string>
	createdAt: string,
	updatedAt: string
}