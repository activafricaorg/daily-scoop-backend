"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    publishers: [new mongoose_1.Schema({
            name: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            feed: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            }
        })],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Category', categorySchema);
