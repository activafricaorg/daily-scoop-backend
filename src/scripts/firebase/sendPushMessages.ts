import TokenModel from "../../models/token.model";
import { initializeApp } from "firebase-admin";

// initialize Firebase
const FCM = initializeApp({
	// credential: applicationDefault()
});

const sendPushMessages = async() => {
	// Get tokens from Token collection
	const rawTokens = await TokenModel.find().select({'fcmToken': 1, '_id': 0});

	// Filter out fcmTokens
	const tokens: string[] = [];
	rawTokens.forEach((token) => tokens.push(token.fcmToken));

	// Send message to subscribed devices
	await FCM.messaging().sendEachForMulticast({
		tokens,
		data: { hello: 'world!' },
	});
}

export default sendPushMessages();