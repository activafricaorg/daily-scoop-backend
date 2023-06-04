require('./utils/env.util.ts');
const mongoose = require("mongoose");
const config = require("../src/configs/db.configs");

(async() => {
	try {
		// Connect the client to the server
		await mongoose.connect(`${config.uri}/`, { dbName: config.database });

		console.log("Connection to Mongo DB server is successful!");
	} catch (error: Error | any) {
		console.error('Unable to connect to database -> ', error);
	}
})();