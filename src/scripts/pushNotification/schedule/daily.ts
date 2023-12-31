import cron from 'node-cron';
import sendPushMessages from "../sendPushMessages";

const DailyPushNotification = async () => {
	// 1. Cron job every day at 9am
	cron.schedule('0 8 * * *', async () => {
		await sendPushMessages("Morning News 🌞", "Before you start your day, catchup on the morning news from your favourite news sources.", { route: "Feed", params: { screen: 'News' }});
	});

	// 2. Cron job every day at 3pm
	cron.schedule('0 14 * * *', async () => {
		await sendPushMessages("Afternoon News ☀️", "A lot has happened since the morning news, check out more news from popular news sources.", { route: "Feed", params: { screen: 'News' }});
		// await importArticles();
	});

	// 3. Cron job every day at 9pm
	cron.schedule('0 20 * * *', async () => {
		await sendPushMessages("Evening News 🌙", "It's the end of the day, but news doesn't stop. Check out more evening news from popular news sources", { route: "Feed", params: { screen: 'News' }});
	});
};

export default DailyPushNotification;