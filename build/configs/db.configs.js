"use strict";
/**
 * Database configuration
 * Author: https://github.com/omeiza
 */
var _a, _b;
module.exports = {
    uri: (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "mongodb://localhost:27017/",
    database: (_b = process.env.MONGO_DB) !== null && _b !== void 0 ? _b : "dailyscoop"
};
