"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_model_1 = __importDefault(require("../models/category.model"));
const article_model_1 = __importDefault(require("../models/article.model"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const result = await category_model_1.default
        .find({}, null, {})
        .select({ "_id": 0, "__v": 0 })
        .lean()
        .exec();
    let publishers = [];
    result.forEach((category) => {
        publishers = publishers.concat(category.publishers);
    });
    if (req.query.search) {
        let matchedPublisher = publishers
            .filter((publisher) => {
            return publisher.name == req.query.search;
        });
        if (matchedPublisher && matchedPublisher.length > 0) {
            const all = [];
            const publishers = matchedPublisher;
            const per_page = req.query && req.query.count ? req.query.count : 24;
            const page = req.query.page && req.query.page ? req.query.page : 1;
            const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 } };
            for (const publisher of publishers) {
                publisher.articles = await article_model_1.default
                    .find({ source: matchedPublisher[0].name }, null, args)
                    .select({ "_id": 0, "__v": 0 })
                    .lean()
                    .exec();
                all.push(publisher);
            }
            return res.json(all);
        }
        return res.status(404).json([]);
    }
    if (publishers && publishers.length > 0)
        return res.json(publishers);
    return res.status(404).json([]);
});
exports.default = router;
