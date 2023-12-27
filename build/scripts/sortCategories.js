"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../utils/env.util");
const promises_1 = __importDefault(require("fs/promises"));
const mongoose_1 = __importDefault(require("mongoose"));
const category_model_1 = __importDefault(require("../models/category.model"));
const config = require("../configs/db.configs");
(async () => {
    if (mongoose_1.default.connection.readyState == 0) {
        try {
            // Connect the client to the server
            mongoose_1.default.connect(`${config.uri}/`, { dbName: config.database })
                .then(async () => {
                await category_model_1.default.deleteMany({});
                promises_1.default.readFile("./categories.json", "utf-8")
                    .then(async (categoriesJSON) => {
                    const categories = JSON.parse(categoriesJSON);
                    console.log(categories);
                    category_model_1.default.insertMany(categories)
                        .then(async () => {
                        console.log(`Successfully added bulk category document to category collection`);
                        await mongoose_1.default.connection.close();
                        console.log("Connection to MongoDB closed");
                    })
                        .catch((err) => {
                        console.error(`Error adding bulk category documents -> ${err}`);
                    });
                });
            });
        }
        catch (error) {
            console.error('Unable to connect to database -> ', error);
            process.exit();
        }
    }
})();
