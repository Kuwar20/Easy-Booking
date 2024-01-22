import { NextFunction, Request, Response } from "express-serve-static-core";
import jwt, { JwtPayload } from "jsonwebtoken";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });


declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies["auth_token"];
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        req.userId = (decoded as JwtPayload).userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "unauthorized" });
    }
}

interface CustomResponse extends Response {
    sendResponse?: (body: any) => void;
}

// Middleware function to cache the result
export const cacheMiddleware = (req: Request, res: CustomResponse, next: NextFunction) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedData = cache.get(key);

    if (cachedData) {
        res.json(cachedData);
        return;
    } else {
        const originalJson = res.json.bind(res);
        res.json = (body: any): CustomResponse => {
            cache.set(key, body);
            return originalJson(body);
        };
        next();
    }
};


export default verifyToken;