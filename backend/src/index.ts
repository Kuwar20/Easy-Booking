import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose, { mongo } from "mongoose";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 7001;

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then((c) => console.log(`Connected to ${c.connections[0].name} database`))
    .catch((err) => console.log(`Error connecting to database: ${err.message}`))


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// this is a test endpoint/api route at '/api/test' to make sure everything is working properly
// you can access using GET at http://localhost:7000/api/test
// and it should return a json object with a message property containing "Hello from express endpoint" (ex: {"message":"Hello from express endpoint"})
// app.get("/api/test", async (req: Request, res: Response) => {
//     res.json({ message: "Hello from express endpoint" });
// });


import logger from '../logger';
import morgan from 'morgan';

// Define a type for the log object
interface LogObject {
    method: string;
    url: string;
    status: string;
    responseTime: string;
}

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat, {
    stream: {
        write: (message: string) => {
            const [method, url, status, responseTime] = message.trim().split(' ');
            const logObject: LogObject = {
                method,
                url,
                status,
                responseTime,
            };
            logger.info(JSON.stringify(logObject));
        }
    }
}));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/my-hotels", myHotelRoutes);

app.use("/api/hotels", hotelRoutes);

app.use("/api/my-bookings", bookingRoutes);

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// 1- Note :-
// In a Node.js backend application, the index.js file serves as the 'entry point' of the application.
// It typically handles tasks such as Server Creation, Database Connection, Middleware Setup, Routes and Controllers, Models Initialization,
// Environment Variables,Error Handling.
