import {PublisherTypes} from "./publisher";
import {Model, Types} from "mongoose";

export type CategoryTypes = {
	name: string,
	slug: string,
	description: string,
	image: string,
	publishers: PublisherTypes[],
	createdAt: string,
	updatedAt: string
}
export type CategoryDocumentTypes = {
	publishers: Types.DocumentArray<PublisherTypes>
}

export type CategoryModelTypes = Model<CategoryTypes, {}, CategoryDocumentTypes>;