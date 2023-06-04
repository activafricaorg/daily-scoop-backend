/**
 * Database configuration
 * Author: https://github.com/omeiza
 */

const env = process.env;
module.exports = {
	uri: env.MONGO_URI ?? "mongodb://localhost:27017",
	user: env.MONGO_USER ?? "",
	password: env.MONGO_PASSWORD ?? "",
	database: env.MONGO_DB ?? "dailyScoop"
}