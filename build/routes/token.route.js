"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const token_model_1 = __importDefault(require("../models/token.model"));
router.get("/", async (req, res) => {
    const result = await token_model_1.default.find({});
    if (result && result.length > 0)
        return res.json(result);
    return res.status(404).json([]);
});
router.get("/:applicationId", async (req, res) => {
    const { applicationId } = req.params;
    const result = await token_model_1.default.findOne({ applicationId });
    if (result && result.length > 0)
        return res.json(result);
    return res.status(404).json([]);
});
router.post("/", async (req, res) => {
    const { applicationId, fcmToken } = req.body;
    try {
        const result = await token_model_1.default.create({
            applicationId: applicationId,
            fcmToken: fcmToken
        });
        return res.json(result);
    }
    catch (err) {
        res.status(422).send(err);
        console.log(err);
    }
});
router.put("/:applicationId", async (req, res) => {
    const { applicationId } = req.params;
    const { fcmToken } = req.body;
    try {
        const result = await token_model_1.default.updateOne({ applicationId }, { fcmToken });
        return res.json(result);
    }
    catch (err) {
        res.status(422).send(err);
        console.log(err);
    }
});
exports.default = router;
