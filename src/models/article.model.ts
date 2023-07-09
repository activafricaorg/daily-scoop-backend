import { Schema, model } from "mongoose";
import { ArticleTypes } from "../types/article";

const articleSchema = new Schema<ArticleTypes>({
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
	source: String,
	description: String,
	sourceImage: String,
	category: String,
	articleDate: String,
	tags: [ String ],
},{ timestamps: true });

export default model<ArticleTypes>('Article', articleSchema);