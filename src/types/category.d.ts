import {Model, Types} from "mongoose";
import {PublisherTypes} from "./publisher";
import {ArticleTypes} from "./article";

export type CategoryTypes = {
	name: string,
	slug: string,
	description: string,
	image: string,
	publishers: PublisherTypes[],
	articles?: ArticleTypes[]
	createdAt: string,
	updatedAt: string
}
export type CategoryDocumentTypes = {
	publishers: Types.DocumentArray<PublisherTypes>
}

export type CategoryModelTypes = Model<CategoryTypes, {}, CategoryDocumentTypes>;