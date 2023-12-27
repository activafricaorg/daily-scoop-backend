"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rss_parser_1 = __importDefault(require("rss-parser"));
const helpers_util_1 = require("../utils/helpers.util");
const article_model_1 = __importDefault(require("../models/article.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const importArticles = async () => {
    const promises = [];
    const articles = [];
    const categories = await category_model_1.default
        .find({}, null, {})
        .select({ "_id": 0, "__v": 0 })
        .populate('publishers')
        .exec();
    categories
        .forEach((category) => {
        for (let publisher of category.publishers) {
            promises.push(new Promise(async (resolve, reject) => {
                try {
                    const getRSS = new rss_parser_1.default();
                    const feed = await getRSS.parseURL(`https://${publisher.feed}`);
                    resolve({
                        category: category,
                        publisher: publisher,
                        feed: feed
                    });
                }
                catch (error) {
                    reject(error);
                }
            }));
        }
    });
    Promise.allSettled(promises)
        .then(async (results) => {
        for (let result of results) {
            if (result.status === 'fulfilled') {
                const value = result.value;
                for (let item of value.feed.items) {
                    const categories = item.categories;
                    const lcCategories = categories && categories.length > 0 ? categories.map(category => category.toLowerCase()) : [];
                    console.log(`Processed article: ${item.link} from ${value.publisher.name}`);
                    articles.push({
                        title: item.title,
                        url: item.link,
                        description: item.contentSnippet ? item.contentSnippet.split("\n")[0] : undefined,
                        image: undefined,
                        source: value.publisher.name,
                        guid: item.title ? (0, helpers_util_1.slugifyText)(item.title) : undefined,
                        category: value.category.name,
                        country: value.publisher.country,
                        tags: lcCategories,
                        articleDate: item.isoDate
                    });
                }
            }
        }
    })
        .then(() => {
        article_model_1.default.insertMany(articles, { ordered: false })
            .then((result) => {
            console.log(`All scrapped articles added`);
        })
            .catch((err) => {
            console.error(`Error adding article documents -> ${err}`);
        });
    });
};
exports.default = importArticles;
