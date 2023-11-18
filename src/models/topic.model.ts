import { Schema, model } from "mongoose";
import { TopicTypes } from "../types/topic";

const TopicSchema = new Schema<TopicTypes>({
	name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		unique: true,
		required: true
	},
	articleCount: {
		type: Number,
		required: true,
		default: 0
	}
},{ timestamps: true });

export default model<TopicTypes>('Topic', TopicSchema);