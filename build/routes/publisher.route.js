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
var express_1 = __importDefault(require("express"));
var category_model_1 = __importDefault(require("../models/category.model"));
var article_model_1 = __importDefault(require("../models/article.model"));
var router = express_1.default.Router();
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, publishers, matchedPublisher, all, publishers_2, per_page, page, args, _i, publishers_1, publisher, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, category_model_1.default
                    .find({}, null, {})
                    .select({ "_id": 0, "__v": 0 })
                    .lean()
                    .exec()];
            case 1:
                result = _b.sent();
                publishers = [];
                result.forEach(function (category) {
                    publishers = publishers.concat(category.publishers);
                });
                if (!req.query.search) return [3 /*break*/, 7];
                matchedPublisher = publishers
                    .filter(function (publisher) {
                    return publisher.name == req.query.search;
                });
                if (!(matchedPublisher && matchedPublisher.length > 0)) return [3 /*break*/, 6];
                all = [];
                publishers_2 = matchedPublisher;
                per_page = req.query && req.query.count ? req.query.count : 24;
                page = req.query.page && req.query.page ? req.query.page : 1;
                args = { limit: per_page, skip: per_page * (page - 1), sort: { articleDate: -1 } };
                _i = 0, publishers_1 = publishers_2;
                _b.label = 2;
            case 2:
                if (!(_i < publishers_1.length)) return [3 /*break*/, 5];
                publisher = publishers_1[_i];
                _a = publisher;
                return [4 /*yield*/, article_model_1.default
                        .find({ source: matchedPublisher[0].name }, null, args)
                        .select({ "_id": 0, "__v": 0 })
                        .lean()
                        .exec()];
            case 3:
                _a.articles = _b.sent();
                all.push(publisher);
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, res.json(all)];
            case 6: return [2 /*return*/, res.status(404).json({
                    status: "No record found"
                })];
            case 7:
                if (publishers.length >= 1)
                    return [2 /*return*/, res.json(publishers)];
                return [2 /*return*/, res.status(404).json({
                        status: "No record found"
                    })];
        }
    });
}); });
exports.default = router;