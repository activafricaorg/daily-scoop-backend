"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rss_parser_1 = __importDefault(require("rss-parser"));
var helpers_util_1 = require("../utils/helpers.util");
var article_model_1 = __importDefault(require("../models/article.model"));
var category_model_1 = __importDefault(require("../models/category.model"));
var importArticles = function () { return __awaiter(void 0, void 0, void 0, function () {
    var promises, articles, categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                promises = [];
                articles = [];
                return [4 /*yield*/, category_model_1.default
                        .find({}, null, {})
                        .select({ "_id": 0, "__v": 0 })
                        .populate('publishers')
                        .exec()];
            case 1:
                categories = _a.sent();
                categories
                    .forEach(function (category) {
                    var _loop_1 = function (publisher) {
                        promises.push(new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                            var getRSS, feed, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        getRSS = new rss_parser_1.default();
                                        return [4 /*yield*/, getRSS.parseURL("https://".concat(publisher.feed))];
                                    case 1:
                                        feed = _a.sent();
                                        resolve({
                                            category: category,
                                            publisher: publisher,
                                            feed: feed
                                        });
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_1 = _a.sent();
                                        reject(error_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }));
                    };
                    for (var _i = 0, _a = category.publishers; _i < _a.length; _i++) {
                        var publisher = _a[_i];
                        _loop_1(publisher);
                    }
                });
                Promise.allSettled(promises)
                    .then(function (results) { return __awaiter(void 0, void 0, void 0, function () {
                    var _i, results_1, result, value, _a, _b, item, categories_1, lcCategories;
                    return __generator(this, function (_c) {
                        for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                            result = results_1[_i];
                            if (result.status === 'fulfilled') {
                                value = result.value;
                                for (_a = 0, _b = value.feed.items; _a < _b.length; _a++) {
                                    item = _b[_a];
                                    categories_1 = item.categories;
                                    lcCategories = categories_1 && categories_1.length > 0 ? categories_1.map(function (category) { return category.toLowerCase(); }) : [];
                                    console.log("Processed article: ".concat(item.link, " from ").concat(value.publisher.name));
                                    articles.push({
                                        title: item.title,
                                        url: item.link,
                                        description: item.contentSnippet ? item.contentSnippet.split("\n")[0] : undefined,
                                        image: undefined,
                                        source: value.publisher.name,
                                        guid: item.title ? (0, helpers_util_1.slugifyText)(item.title) : undefined,
                                        category: value.category.name,
                                        country: value.publisher.country,
                                        tags: lcCategories,
                                        articleDate: item.isoDate
                                    });
                                }
                            }
                        }
                        return [2 /*return*/];
                    });
                }); })
                    .then(function () {
                    article_model_1.default.insertMany(articles, { ordered: false })
                        .then(function (result) {
                        console.log("All scrapped articles added");
                    })
                        .catch(function (err) {
                        console.error("Error adding article documents -> ".concat(err));
                    });
                });
                return [2 /*return*/];
        }
    });
}); };
exports.default = importArticles;
