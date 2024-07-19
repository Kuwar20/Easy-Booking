import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/auth';

const router = express.Router();

import dotenv from 'dotenv';
dotenv.config();
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/login", [
    check("email", "Email is required").isEmail().optional(),
    check("password", "password with 6 or more characters required").isLength({ min: 6 }).optional(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
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
            const email = payload?.email;

            if (!email) {
                return res.status(400).json({ message: "Invalid Google credential" });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "User not found. Please sign up first." });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1h" });

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });

            return res.status(200).json({ userId: user._id });
        } else {
            // Regular login flow
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid Credentials" });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1h" });

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });

            res.status(200).json({ userId: user._id });
        }
    } catch (error) {
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

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
    res.cookie("auth_token","",{
    expires: new Date(0),
    });
    res.send();
});


export default router;