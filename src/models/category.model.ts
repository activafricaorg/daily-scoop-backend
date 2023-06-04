import {Schema, model} from "mongoose";

// Interface representing a publisher (child documents) in MongoDB
interface IPublisher {
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

const publisherSchema = new Schema<IPublisher> ({
	name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	}
});

const categorySchema =  new Schema<ICategory> ({
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
	publishers: [ publisherSchema ],
},{ timestamps: true });

module.exports = model<ICategory>('Category', categorySchema);