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
    const filter = {};
    if (req.query.q) {
        const query = req.query.q;
        filter.slug = { $regex: query };
    }
    const result = await category_model_1.default
        .find(filter, null, {})
        .select({ "_id": 0, "__v": 0 })
        .exec();
    if (result && result.length > 0)
        return res.json(result);
    return res.status(404).json([]);
});
router.get("/:category", async (req, res) => {
    const result = await category_model_1.default
        .findOne({ slug: req.params.category }, null, {})
        .select({ "_id": 0, "__v": 0, "createdAt": 0, "updatedAt": 0 })
        .lean()
        .exec();
    if (result && Object.keys(result).length > 0) {
        const categoryFilter = {};
        const countryFilter = {};
        const category = result;
        const per_page = req.query && req.query.count ? req.query.count : 24;
        const page = req.query.page && req.query.page ? req.query.page : 1;
        const args = { limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 } };
        categoryFilter.category = result.name;
        if (req.query.country)
            countryFilter.country = req.query.country;
        category.articles = await article_model_1.default
            .find({
            $and: [
                categoryFilter,
                {
                    $or: [
                        countryFilter,
                        { country: 'all' },
                    ]
                }
            ]
        }, null, args)
            .select({ "_id": 0, "__v": 0 })
            .exec();
        return res.json(category);
    }
    return res.status(404).json([]);
});
exports.default = router;
