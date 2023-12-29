import mongoose from 'mongoose';
//This line imports the Mongoose library, which provides a straightforward, schema-based solution to model your application data with MongoDB.
import bcrypt from 'bcryptjs';

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};
//This TypeScript type definition describes the shape/structure of a User object. Each user has an _id, email, password, firstName, and lastName. All of these fields are strings
//This is defining the structure of a User in our application. 

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});
//This line defines a Mongoose schema for a User. A schema maps to a MongoDB collection and defines the shape of the documents within that collection.
//It's like a translator that helps MongoDB understand what a User should look like in the database.
// It says that each User in the database should have an email, password, firstName, and lastName, and all of these should be strings. The email should be unique, and all fields are required.

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model<UserType>("User", userSchema);
//This line creates a Mongoose model from the User schema.
//Note that Mongoose will lowercase the name and pluralize it. So in our MongoDB database, 
//the collection will actually be named "users", not "User".

export default User;

// 2- Note :-
// After we setup index.js, we typically proceed to define our data models.
// (a data model provides a structured way to organize and represent data in a database)
// In the context of a backend application using a database (e.g., MongoDB with Mongoose),
// a model is a JavaScript representation of a database entity or collection.