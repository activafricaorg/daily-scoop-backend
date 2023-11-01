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
var open_graph_scraper_1 = __importDefault(require("open-graph-scraper"));
var helpers_util_1 = require("../utils/helpers.util");
var rss_parser_1 = __importDefault(require("rss-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var article_model_1 = __importDefault(require("../models/article.model"));
var category_model_1 = __importDefault(require("../models/category.model"));
var config = require("../configs/db.configs");
var importArticles = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1, categories, articles, _i, categories_1, category, _a, _b, publisher, getRSS, feed, _c, _d, item, result, lcCategories, err_1;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!(mongoose_1.default.connection.readyState == 0)) return [3 /*break*/, 4];
                _f.label = 1;
            case 1:
                _f.trys.push([1, 3, , 4]);
                // Connect the client to the server
                return [4 /*yield*/, mongoose_1.default.connect("".concat(config.uri, "/"), { dbName: config.database })];
            case 2:
                // Connect the client to the server
                _f.sent();
                console.log("Connection to MongoDB started successfully!");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _f.sent();
                console.error('Unable to connect to database -> ', error_1);
                process.exit();
                return [3 /*break*/, 4];
            case 4: return [4 /*yield*/, category_model_1.default
                    .find({}, null, {})
                    .select({ "_id": 0, "__v": 0 })
                    .populate('publishers')
                    .exec()];
            case 5:
                categories = _f.sent();
                articles = [];
                _i = 0, categories_1 = categories;
                _f.label = 6;
            case 6:
                if (!(_i < categories_1.length)) return [3 /*break*/, 16];
                category = categories_1[_i];
                if (!(category.name !== 'tech')) return [3 /*break*/, 15];
                _a = 0, _b = category.publishers;
                _f.label = 7;
            case 7:
                if (!(_a < _b.length)) return [3 /*break*/, 15];
                publisher = _b[_a];
                getRSS = new rss_parser_1.default();
                return [4 /*yield*/, getRSS.parseURL("https://".concat(publisher.feed))];
            case 8:
                feed = _f.sent();
                _c = 0, _d = feed.items;
                _f.label = 9;
            case 9:
                if (!(_c < _d.length)) return [3 /*break*/, 14];
                item = _d[_c];
                if (!item.link) return [3 /*break*/, 13];
                _f.label = 10;
            case 10:
                _f.trys.push([10, 12, , 13]);
                console.log("Processing article -> ".concat(item.link, " from ").concat(publisher.name));
                return [4 /*yield*/, (0, open_graph_scraper_1.default)({ url: item.link })];
            case 11:
                result = (_f.sent()).result;
                if (result.success) {
                    lcCategories = (_e = item.categories) === null || _e === void 0 ? void 0 : _e.map(function (category) {
                        return category.toLowerCase();
                    });
                    articles.push({
                        title: result.ogTitle,
                        url: result.ogUrl,
                        description: result.ogDescription,
                        image: result.ogImage ? result.ogImage[0].url : undefined,
                        source: publisher.name,
                        guid: result.ogTitle ? (0, helpers_util_1.slugifyText)(result.ogTitle) : undefined,
                        category: category.name,
                        country: publisher.country,
                        tags: lcCategories,
                        articleDate: item.isoDate
                    });
                }
                else {
                    return [3 /*break*/, 13];
                }
                if (feed.items.indexOf(item) == feed.items.length - 1
                    && (category.publishers).indexOf(publisher) == (category.publishers).length - 1
                    && categories.indexOf(category) == categories.length - 1) {
                    article_model_1.default.insertMany(articles, { ordered: false })
                        .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.error("Articles added");
                            return [2 /*return*/];
                        });
                    }); })
                        .catch(function (err) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.error("Error adding article documents -> ".concat(err));
                            return [2 /*return*/];
                        });
                    }); });
                }
                return [3 /*break*/, 13];
            case 12:
                err_1 = _f.sent();
                console.log(err_1);
                return [3 /*break*/, 13];
            case 13:
                _c++;
                return [3 /*break*/, 9];
            case 14:
                _a++;
                return [3 /*break*/, 7];
            case 15:
                _i++;
                return [3 /*break*/, 6];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.default = importArticles;
