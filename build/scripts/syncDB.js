"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../utils/env.util");
const promises_1 = __importDefault(require("fs/promises"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const config = require("../configs/db.configs");
(async () => {
    try {
        // Connect the client to the server
        await mongoose_1.default.connect(`${config.uri}/`, { dbName: config.database });
        console.log("Connection to MongoDB started successfully!");
        promises_1.default.readdir(path_1.default.resolve("./src/models"))
            .then(async (files) => {
            if (files.length != 0) {
                files
                    .filter((file) => {
                    return (file.indexOf(".") !== 0)
                        && (file.slice(-2) === "ts");
                })
                    .forEach((file) => {
                    const Model = require(path_1.default.join("../models/", file));
                    Model.createCollection()
                        .then(async () => {
                        console.log(`${file.split(".")[0]} collection created`);
                        // Check if we are in final iteration
                        if (files.indexOf(file) == files.length - 1) {
                            await mongoose_1.default.connection.close();
                            console.log("Connection to MongoDB closed");
                        }
                    })
                        .catch((err) => {
                        console.error(`Could not create collection -> ${err}`);
                    });
                });
            }
            else {
                console.error(`Model directory is empty! -> ${files}`);
                await mongoose_1.default.connection.close();
                console.log("Connection to MongoDB closed");
            }
        })
            .catch(async (err) => {
            console.error(`Error creating collection: ${err}`);
            await mongoose_1.default.connection.close();
            console.log("Connection to MongoDB closed");
        });
    }
    catch (error) {
        console.error(`Unable to connect to database: ${error}`);
        await mongoose_1.default.connection.close();
        console.log("Connection to MongoDB closed");
    }
})();
