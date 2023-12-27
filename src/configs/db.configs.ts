/**
 * Database configuration
 * Author: https://github.com/omeiza
 */

module.exports = {
	uri: process.env.MONGO_URI ?? "mongodb://localhost:27017/",
	database: process.env.MONGO_DB ?? "dailyscoop"
}