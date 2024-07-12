"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default({ stdTTL: 60 });
const verifyToken = (req, res, next) => {
    const token = req.cookies["auth_token"];
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "unauthorized" });
    }
};
// Middleware function to cache the result
const cacheMiddleware = (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedData = cache.get(key);
    if (cachedData) {
        res.json(cachedData);
        return;
    }
    else {
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            cache.set(key, body);
            return originalJson(body);
        };
        next();
    }
};
exports.cacheMiddleware = cacheMiddleware;
exports.default = verifyToken;
