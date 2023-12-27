"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const article_model_1 = __importDefault(require("../models/article.model"));
const topic_model_1 = __importDefault(require("../models/topic.model"));
router.get("/", async (req, res) => {
    const topicFilter = {};
    const per_page = req.query && req.query.count ? req.query.count : 24;
    const page = req.query.page && req.query.page ? req.query.page : 1;
    const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleCount: -1 } };
    if (req.query.country)
        topicFilter.country = req.query.country;
    const result = await topic_model_1.default
        .find({
        $or: [
            topicFilter,
            { country: 'all' },
        ]
    }, null, args)
        .select({ "_id": 0, "__v": 0 })
        .lean()
        .exec();
    if (result && result.length > 0)
        return res.json(result);
    return res.status(404).json([]);
});
router.get("/:slug", async (req, res) => {
    const per_page = req.query && req.query.count ? req.query.count : 24;
    const page = req.query && req.query.page ? req.query.page : 1;
    const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 } };
    const tagArray = (req.params.slug).split("-").join(" ");
    const result = await article_model_1.default
        .find({ tags: { $in: tagArray } }, null, args)
        .select({ "_id": 0, "__v": 0 })
        .lean()
        .exec();
    if (result)
        return res.json(result);
    return res.status(404).json([]);
});
exports.default = router;
