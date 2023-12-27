"use strict";
/**
 * Helper functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifyText = void 0;
const slugifyText = (input) => {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.slugifyText = slugifyText;
