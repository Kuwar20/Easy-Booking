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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.get("/me", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield user_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
}));
// /api/users/register
router.post("/register", [
    // to basic form validation
    // check("firstName", "First Name is required").isString().not().isEmpty(),
    // problem is this is when it gets an condition(here error) it will stop checking the other conditions
    // check("firstName").custom((value, { req }) => {
    //     if (!value) {
    //         throw new Error("Firstname is required");
    //     } else if (value === req.body.email) {
    //         throw new Error("Firstname cannot be the same as the email");
    //     } else if (value === req.body.password) {
    //         throw new Error("Firstname cannot be the same as the password");
    //     } else if (value === req.body.lastName) {
    //         throw new Error("Firstname cannot be the same as the lastName");
    //     }
    //     return true;
    // }).not().isEmpty(),
    // check("lastName").custom((value, { req }) => {
    //     if (!value) {
    //         throw new Error("LastName is required");
    //     } else if (value === req.body.email) {
    //         throw new Error("LastName cannot be the same as the email");
    //     } else if (value === req.body.password) {
    //         throw new Error("LastName cannot be the same as the password");
    //     } else if (value === req.body.firstName) {
    //         throw new Error("LastName cannot be the same as the firstName");
    //     }
    //     return true;
    // }).not().isEmpty(),
    (0, express_validator_1.check)("firstName").custom((value, { req }) => {
        const errors = [];
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
    (0, express_validator_1.check)("lastName").custom((value, { req }) => {
        const errors = [];
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
    (0, express_validator_1.check)("email", "Please enter a valid email").isEmail(), // here not empty will give 2 same error message
    //check("password", "Password should be 8 or more character").isLength({ min: 8 }),
    // check("password").custom((value, { req }) => {
    //     if (!value) {
    //         throw new Error("Password is required");
    //     } else if (value.length < 8) {
    //         throw new Error("Password should be 8 or more characters");
    //     }
    //     return true;
    // }),
    (0, express_validator_1.check)("password").custom((value, { req }) => {
        const errors = [];
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
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = yield user_1.default.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send({ message: "The user already exists" });
        }
        user = new user_1.default(req.body);
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        return res.status(200).send({ message: "User registered OK" }); // without json() it will not return anything when we hit the api, even though the api is working fine
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
exports.default = router;
// 3- Note :-
//Routes define how an application responds to different HTTP (GET, POST, PUT, DELETE, etc.)  requests and navigate users to specific pages or functionalities.
//Routes are a fundamental part of web development and are often used in the backend to handle different endpoints
