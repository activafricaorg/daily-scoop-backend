import {Schema, model} from "mongoose";
import {CategoryTypes, CategoryModelTypes} from "../types/category";
import {PublisherTypes} from "../types/publisher";

const categorySchema = new Schema<CategoryTypes, CategoryModelTypes> ({
	name: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	publishers: [new Schema<PublisherTypes> ({
		name: {
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
		}
	})],
},{ timestamps: true });

export default model<CategoryTypes, CategoryModelTypes>('Category', categorySchema);