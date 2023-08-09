import { Schema, model } from "mongoose";
import { ArticleTypes } from "../types/article";

const ArticleSchema = new Schema<ArticleTypes>({
	title: {
		type: String,
		required: true
	},
	url: {
		type: String,
		unique: true,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	guid: String,
	source: String,
	category: String,
	country: String,
	description: String,
	articleDate: String,
	tags: [ String ],
},{ timestamps: true });

export default model<ArticleTypes>('Article', ArticleSchema);