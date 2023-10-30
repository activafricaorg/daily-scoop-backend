"use strict";
/**
 * Database configuration
 * Author: https://github.com/omeiza
 */
var _a, _b;
// const env = process.env;
module.exports = {
    uri: (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "mongodb+srv://omeiza:avxt9g8pX5g8V224@cluster0.diih52x.mongodb.net",
    database: (_b = process.env.MONGO_DB) !== null && _b !== void 0 ? _b : "dailyscoop"
};
