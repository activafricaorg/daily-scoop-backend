import { Schema, model } from "mongoose";
import { JobTypes } from "../types/job";

const JobSchema = new Schema<JobTypes>({
	title: {
		type: String,
		required: true
	},
	url: {
		type: String,
		unique: true,
		required: true
	},
	source: String,
	employer: String,
	location: String,
	attributes: [ String ]
},{ timestamps: true });

export default model<JobTypes>('Job', JobSchema);