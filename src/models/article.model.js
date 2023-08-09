"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var articleSchema = new mongoose_1.Schema({
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
        type: String,
        required: true
    },
    source: String,
    description: String,
    sourceImage: String,
    category: String,
    articleDate: String,
    tags: [String],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Article', articleSchema);
