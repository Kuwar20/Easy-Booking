// this implements load balancing across CPU cores on a single machine, it's not the same as load balancing across multiple servers. 
import cluster from 'cluster';
import os from 'os';
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import logger from '../logger';
import morgan from 'morgan';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Restart the worker
    });
} else {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const PORT = process.env.PORT || 7001;
    
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
        .then((c) => console.log(`Worker ${process.pid} connected to ${c.connections[0].name} database`))
        .catch((err) => console.log(`Error connecting to database: ${err.message}`));

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
    
    const morganFormat = ':method :url :status :response-time ms :worker';
    morgan.token('worker', () => `Worker ${process.pid} on port ${PORT}`);
    
    app.use(morgan(morganFormat, {
        stream: {
            write: (message: string) => {
                const [method, url, status, responseTime, workerInfo] = message.trim().split(' ');
                const logObject = {
                    method,
                    url,
                    status,
                    responseTime,
                    worker: workerInfo,
                };
                logger.info(JSON.stringify(logObject));
            }
        }
    }));

    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/my-hotels", myHotelRoutes);
    app.use("/api/hotels", hotelRoutes);
    app.use("/api/my-bookings", bookingRoutes);
    
    app.get("*", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });

    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} is running on port ${PORT}`);
    });

    console.log(`Worker ${process.pid} started`);
}

// // 1- Note :-
// // In a Node.js backend application, the index.js file serves as the 'entry point' of the application.
// // It typically handles tasks such as Server Creation, Database Connection, Middleware Setup, Routes and Controllers, Models Initialization,
// // Environment Variables,Error Handling.
