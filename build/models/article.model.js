"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ArticleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String
    },
    guid: String,
    source: String,
    category: String,
    country: String,
    description: String,
    articleDate: String,
    tags: [String],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Article', ArticleSchema);
