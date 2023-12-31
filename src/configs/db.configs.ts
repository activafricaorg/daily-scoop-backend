/**
 * Database configuration
 * Author: https://github.com/omeiza
 */

module.exports = {
	uri: process.env.MONGO_URI ?? "mongodb+srv://omeiza:avxt9g8pX5g8V224@cluster0.diih52x.mongodb.net",
	database: process.env.MONGO_DB ?? "dailyscoop"
}