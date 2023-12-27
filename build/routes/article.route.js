"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const article_model_1 = __importDefault(require("../models/article.model"));
router.get("/", async (req, res) => {
    const articleFilter = {};
    const per_page = req.query && req.query.count ? req.query.count : 24;
    const page = req.query.page && req.query.page ? req.query.page : 1;
    const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 } };
    if (req.query.country)
        articleFilter.country = req.query.country;
    const result = await article_model_1.default
        .find({
        $or: [
            articleFilter,
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
router.get("/all", async (req, res) => {
    const result = await article_model_1.default
        .find({}, null, {})
        .select({ "_id": 0, "__v": 0 })
        .lean()
        .exec();
    if (result && result.length > 0)
        return res.json(result);
    return res.status(404).json([]);
});
router.get("/:guid", async (req, res) => {
    const per_page = req.query && req.query.count ? req.query.count : 24;
    const page = req.query.page && req.query.page ? req.query.page : 1;
    const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 } };
    const result = await article_model_1.default
        .findOne({ guid: req.params.guid }, null, args)
        .select({ "_id": 0, "__v": 0 })
        .lean()
        .exec();
    if (result) {
        result.related = await article_model_1.default
            .find({ category: result.category }, null, args)
            .where("guid").ne(req.params.guid)
            .select({ "_id": 0, "__v": 0 })
            .exec();
        return res.json(result);
    }
    return res.status(404).json([]);
});
exports.default = router;
