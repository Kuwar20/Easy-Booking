"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const my_hotels_1 = __importDefault(require("./routes/my-hotels"));
const hotels_1 = __importDefault(require("./routes/hotels"));
const my_bookings_1 = __importDefault(require("./routes/my-bookings"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const PORT = process.env.PORT || 7001;
mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING)
    .then((c) => console.log(`Connected to ${c.connections[0].name} database`))
    .catch((err) => console.log(`Error connecting to database: ${err.message}`));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
// this is a test endpoint/api route at '/api/test' to make sure everything is working properly
// you can access using GET at http://localhost:7000/api/test
// and it should return a json object with a message property containing "Hello from express endpoint" (ex: {"message":"Hello from express endpoint"})
// app.get("/api/test", async (req: Request, res: Response) => {
//     res.json({ message: "Hello from express endpoint" });
// });
const logger_1 = __importDefault(require("../logger"));
const morgan_1 = __importDefault(require("morgan"));
const morganFormat = ':method :url :status :response-time ms';
app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const [method, url, status, responseTime] = message.trim().split(' ');
            const logObject = {
                method,
                url,
                status,
                responseTime,
            };
            logger_1.default.info(JSON.stringify(logObject));
        }
    }
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
app.use("/api/auth", auth_1.default);
app.use("/api/users", user_1.default);
app.use("/api/my-hotels", my_hotels_1.default);
app.use("/api/hotels", hotels_1.default);
app.use("/api/my-bookings", my_bookings_1.default);
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/dist/index.html"));
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// 1- Note :-
// In a Node.js backend application, the index.js file serves as the 'entry point' of the application.
// It typically handles tasks such as Server Creation, Database Connection, Middleware Setup, Routes and Controllers, Models Initialization,
// Environment Variables,Error Handling.
