import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

// /api/users/register
router.post("/register", async (req: Request, res: Response) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ msg: "The user already exists" });
        }

        user = new User(req.body);
        await user.save();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d",
        }
        );
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        })
        return res.status(200).json({ message: "User registered successfully" }); // without json() it will not return anything when we hit the api, even though the api is working fine
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;

// 3- Note :-
//Routes define how an application responds to different HTTP (GET, POST, PUT, DELETE, etc.)  requests and navigate users to specific pages or functionalities.
//Routes are a fundamental part of web development and are often used in the backend to handle different endpoints
