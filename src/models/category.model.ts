import { Schema, model, Types, Model } from "mongoose";

// Interface representing a publisher (child documents) in MongoDB
interface IPublisher {
	_id: Types.ObjectId,
	name: string,
	url: string
}

// Interface representing a category (parent documents) in MongoDB
interface ICategory {
	name: string,
	slug: string,
	description: string,
	image: string,
	publishers: IPublisher[]
	createdAt: string,
	updatedAt: string
}

// TMethodsAndOverrides
type ICategoryDocumentProps = { publishers: Types.DocumentArray<IPublisher> }
type ICategoryModelType = Model<ICategory, {}, ICategoryDocumentProps>;

const categorySchema = new Schema<ICategory, ICategoryModelType> ({
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
	publishers: [new Schema<IPublisher> ({
		name: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	})],
},{ timestamps: true });

module.exports = model<ICategory, ICategoryModelType>('Category', categorySchema);