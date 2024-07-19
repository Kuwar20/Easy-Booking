import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { body, check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
const router = express.Router();

import dotenv from 'dotenv';
dotenv.config();
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.get("/me", verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

// /api/users/register
router.post("/register", [
    
    check("firstName").custom((value, { req }) => {
        const errors: string[] = [];

        if (!value) {
            errors.push("Firstname is required");
        }

        if (value === req.body.email) {
            errors.push("Firstname cannot be the same as the email");
        }

        if (value === req.body.password) {
            errors.push("Firstname cannot be the same as the password");
        }

        if (value === req.body.lastName) {
            errors.push("Firstname cannot be the same as the lastName");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(", "));
        }

        return true;
    }),

    check("lastName").custom((value, { req }) => {
        const errors: string[] = [];

        if (!value) {
            errors.push("LastName is required");
        }

        if (value === req.body.email) {
            errors.push("LastName cannot be the same as the email");
        }

        if (value === req.body.password) {
            errors.push("LastName cannot be the same as the password");
        }

        if (value === req.body.firstName) {
            errors.push("LastName cannot be the same as the firstName");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(", "));
        }

        return true;
    }),

    // check("lastName", "Last Name is required").isString().not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(), // here not empty will give 2 same error message
    
    //check("password", "Password should be 8 or more character").isLength({ min: 8 }),
    // check("password").custom((value, { req }) => {
    //     if (!value) {
    //         throw new Error("Password is required");
    //     } else if (value.length < 8) {
    //         throw new Error("Password should be 8 or more characters");
    //     }
    //     return true;
    // }),

    check("password").custom((value, { req }) => {
        const errors: string[] = [];

        if (!value) {
            errors.push("Password is required");
        }

        if (value.length < 8) {
            errors.push("Password should be 8 or more characters");
        }


        if (!/[a-z]/.test(value)) {
            errors.push("Password should contain at least one lowercase letter");
        }

        if (!/[A-Z]/.test(value)) {
            errors.push("Password should contain at least one uppercase letter");
        }

        if (!/\d/.test(value)) {
            errors.push("Password should contain at least one numerical digit");
        }

        if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value)) {
            errors.push("Password should contain at least one special character");
        }

        if (/\s/.test(value)) {
            errors.push("Password should not contain spaces");
        }

        if (value === req.body.email) {
            errors.push("Password cannot be the same as the email");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(", "));
        }

        return true;
    }),

], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty() && !req.body.credential) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (req.body.credential) {
            // Google signup flow
            const ticket = await client.verifyIdToken({
                idToken: req.body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const email = payload?.email;

            if (!email) {
                return res.status(400).json({ message: "Invalid Google credential" });
            }

            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ message: "User with this email already exists" });
            }

            // Generate a default password
            const defaultPassword = 'defaultPassword';

            user = new User({
                email,
                firstName: payload?.given_name || "",
                lastName: payload?.family_name || "",
                password: defaultPassword,
            });
            await user.save();

            // Generate JWT and set cookie for Google signup
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
                expiresIn: "1d",
            });

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });

            return res.status(200).json({ 
                message: "Google signup successful",
                defaultPassword: defaultPassword // Send this only in development
            });
        } else {
            // Regular registration flow
            let user = await User.findOne({ email: req.body.email });

            if (user) {
                return res.status(400).json({ message: "The user already exists" });
            }

            user = new User({...req.body});
            await user.save();

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
                expiresIn: "1d",
            });

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });

            return res.status(200).json({ message: "User registered successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error });
    }
});

export default router;

// 3- Note :-
//Routes define how an application responds to different HTTP (GET, POST, PUT, DELETE, etc.)  requests and navigate users to specific pages or functionalities.
//Routes are a fundamental part of web development and are often used in the backend to handle different endpoints
