import { Schema, model } from "mongoose";
import { TokenTypes } from "../types/token";

const TokenSchema = new Schema<TokenTypes>({
	applicationId: {
		type: Number,
		unique: true,
		required: true
	},
	fcmToken: {
		type: String,
		required: true
	}
},{ timestamps: true });

export default model<TokenTypes>('Token', TokenSchema);