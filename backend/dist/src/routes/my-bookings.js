"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const hotel_1 = __importDefault(require("../models/hotel"));
const router = express_1.default.Router();
// /api/my-bookings
router.get("/", auth_1.default, async (req, res) => {
    try {
        const hotels = await hotel_1.default.find({
            bookings: { $elemMatch: { userId: req.userId } },
        });
        const results = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter((booking) => booking.userId === req.userId);
            const hotelWithUserBookings = Object.assign(Object.assign({}, hotel.toObject()), { bookings: userBookings });
            return hotelWithUserBookings;
        });
        res.status(200).send(results);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to fetch bookings" });
    }
});
exports.default = router;
