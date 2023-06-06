import { Schema, model, Types } from "mongoose";

// Interface representing a content document in MongoDB
interface IArticle {
	_id: Types.ObjectId,
	title: string,
	url: string,
	image: string,
	category: Types.Array<string>
	createdAt: string,
	updatedAt: string
}

const articleSchema = new Schema<IArticle>({
	title: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	category: [ String ]
},{ timestamps: true });

export default model<IArticle>('Article', articleSchema);