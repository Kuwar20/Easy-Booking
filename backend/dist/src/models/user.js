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
const mongoose_1 = __importDefault(require("mongoose"));
//This line imports the Mongoose library, which provides a straightforward, schema-based solution to model your application data with MongoDB.
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});
//This line defines a Mongoose schema for a User. A schema maps to a MongoDB collection and defines the shape of the documents within that collection.
//It's like a translator that helps MongoDB understand what a User should look like in the database.
// It says that each User in the database should have an email, password, firstName, and lastName, and all of these should be strings. The email should be unique, and all fields are required.
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcryptjs_1.default.hash(this.password, 8);
        }
        next();
    });
});
const User = mongoose_1.default.model("User", userSchema);
//This line creates a Mongoose model from the User schema.
//Note that Mongoose will lowercase the name and pluralize it. So in our MongoDB database, 
//the collection will actually be named "users", not "User".
exports.default = User;
// 2- Note :-
// After we setup index.js, we typically proceed to define our data models.
// (a data model provides a structured way to organize and represent data in a database)
// In the context of a backend application using a database (e.g., MongoDB with Mongoose),
// a model is a JavaScript representation of a database entity or collection.
