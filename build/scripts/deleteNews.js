"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const article_model_1 = __importDefault(require("../models/article.model"));
const deleteNews = () => {
    const promise = new Promise(async (resolve, reject) => {
        const older_than = (0, moment_1.default)().subtract(14, 'days').toDate();
        const { deletedCount } = await article_model_1.default.find({ createdAt: { $lte: older_than } }).deleteMany().exec();
        if (deletedCount)
            resolve(deletedCount);
        reject(new Error(`Unable to delete stale articles`));
    });
    promise.then(result => { console.log(`Successfully deleted ${result} stale news`); }, error => { console.log(error); });
};
exports.default = deleteNews;
