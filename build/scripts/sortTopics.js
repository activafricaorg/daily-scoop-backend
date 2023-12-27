"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const article_model_1 = __importDefault(require("../models/article.model"));
const topic_model_1 = __importDefault(require("../models/topic.model"));
const sortTopics = async () => {
    await topic_model_1.default.deleteMany({});
    const articles = await article_model_1.default
        .find({}, null, {})
        .select({ "_id": 0, "__v": 0 })
        .lean()
        .exec();
    if (articles) {
        let topics = [];
        for (let article of articles) {
            for (let tag of article.tags) {
                let found = topics.find(topic => topic.name === tag);
                let temp = [];
                if (found) {
                    let index = topics.findIndex((topic => topic.name === tag));
                    topics[index].articleCount++;
                }
                else {
                    temp.push({
                        name: tag,
                        country: article.country,
                        articleCount: 1
                    });
                }
                topics = topics.concat(temp);
            }
        }
        // console.log(topics);
        topic_model_1.default.insertMany(topics, { ordered: false })
            .then((result) => {
            console.log(`Topics updated!`);
        })
            .catch((err) => {
            console.error(`Error setting up topics -> ${err}`);
        });
    }
};
exports.default = sortTopics;
