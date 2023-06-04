import { Schema, model, Types } from "mongoose";

// Interface representing a content document in MongoDB
interface IContent {
	_id: Types.ObjectId,
	title: string,
	url: string,
	image: string,
	category: Types.Array<string>
	createdAt: string,
	updatedAt: string
}

const contentSchema = new Schema<IContent>({
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

module.exports = model<IContent>('Category', contentSchema);