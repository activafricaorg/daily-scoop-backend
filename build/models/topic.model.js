"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TopicSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    articleCount: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Topic', TopicSchema);
