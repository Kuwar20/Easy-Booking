"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post("/login", [
    (0, express_validator_1.check)("email", "Email is required").isEmail().optional(),
    (0, express_validator_1.check)("password", "password with 6 or more characters required").isLength({ min: 6 }).optional(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty() && !req.body.credential) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        if (req.body.credential) {
            // Google login flow
            const ticket = await client.verifyIdToken({
                idToken: req.body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const email = payload === null || payload === void 0 ? void 0 : payload.email;
            if (!email) {
                return res.status(400).json({ message: "Invalid Google credential" });
            }
            const user = await user_1.default.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User not found. Please sign up first." });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });
            return res.status(200).json({ userId: user._id });
        }
        else {
            // Regular login flow
            const { email, password } = req.body;
            const user = await user_1.default.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });
            res.status(200).json({ userId: user._id });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
// router.post("/login", [
//     check("email", "Email is required").isEmail(),
//     check("password", "password with 6 or more characters required").isLength({ min: 6 }),
// ], async (req: Request, res: Response) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ message: errors.array() });
//     }
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid Credentials" });
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid Credentials" });
//         }
//         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string,
//             { expiresIn: "1h" });
//         res.cookie("auth_token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 86400000,
//         });
//         res.status(200).json({ userId: user._id });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Server Error" });
//     }
// });
router.get("/validate-token", auth_1.default, (req, res) => {
    res.status(200).send({ userId: req.userId });
});
router.post("/logout", (req, res) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
});
exports.default = router;
