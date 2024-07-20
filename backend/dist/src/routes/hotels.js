"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotel_1 = __importDefault(require("../models/hotel"));
const express_validator_1 = require("express-validator");
const stripe_1 = __importDefault(require("stripe"));
const auth_1 = __importStar(require("../middleware/auth"));
const lodash_1 = require("lodash");
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY);
const router = express_1.default.Router();
const memoizedFetchHotels = (0, lodash_1.memoize)(async function () {
    try {
        const hotels = await hotel_1.default.find().sort("-lastUpdated");
        return hotels;
    }
    catch (error) {
        console.log("Error fetching hotels:", error);
        throw error; // Propagate error to caller
    }
});
router.get("/search", auth_1.cacheMiddleware, async (req, res) => {
    try {
        const query = constructSearchQuery(req.query);
        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;
        const hotels = await hotel_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);
        const total = await hotel_1.default.countDocuments(query);
        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };
        res.json(response);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.get('/search/suggestion/:query', auth_1.cacheMiddleware, async (req, res) => {
    let query = req.params.query; // Get the search query from the URL
    console.log('Search Query:', query); // Check the value of query
    try {
        let hotels = await hotel_1.default.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { city: { $regex: query, $options: "i" } },
                { country: { $regex: query, $options: "i" } },
            ],
        }).limit(5);
        res.status(200).json(hotels);
    }
    catch (error) {
        console.error('Error searching hotels:', error); // Log any errors
        res.status(500).json({ message: "Error searching hotels" });
    }
});
// router.get("/", async (req: Request, res: Response) => {
//     try {
//         const hotels = await Hotel.find().sort("-lastUpdated");
//         res.json(hotels);
//     } catch (error) {
//         console.log("error", error);
//         res.status(500).json({ message: "Error fetching hotels" });
//     }
// });
//Route handler with memoized function
router.get("/", async (req, res) => {
    try {
        const hotels = await memoizedFetchHotels(); // Use memoized function
        res.json(hotels);
    }
    catch (error) {
        console.log("Error in route handler:", error);
        res.status(500).json({ message: "Error fetching hotels" });
    }
});
router.get("/:id", [(0, express_validator_1.param)("id").notEmpty().withMessage("Hotel ID is required")], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();
    try {
        const hotel = await hotel_1.default.findById(id);
        res.json(hotel);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching hotel" });
    }
});
router.post("/:hotelId/bookings/payment-intent", auth_1.default, async (req, res) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;
    const userId = req.userId;
    const hotel = await hotel_1.default.findById(hotelId);
    if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
    }
    const totalCost = hotel.pricePerNight * numberOfNights;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "gbp",
        description: `Payment for ${numberOfNights} nights at ${hotel.name}`,
        metadata: {
            hotelId,
            userId: req.userId,
        },
    });
    if (!paymentIntent.client_secret) {
        return res.status(500).json({ message: "Error creating payment intent" });
    }
    const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
    };
    res.send(response);
});
router.post("/:hotelId/bookings", auth_1.default, async (req, res) => {
    try {
        const paymentIntentId = req.body.paymentIntentId;
        if (!paymentIntentId) {
            return res.status(400).json({ message: "Payment intent ID is required" });
        }
        const newBooking = Object.assign(Object.assign({}, req.body), { userId: req.userId });
        const hotel = await hotel_1.default.findOneAndUpdate({ _id: req.params.hotelId }, {
            $push: { bookings: newBooking },
        }, { new: true });
        if (!hotel) {
            return res.status(400).json({ message: "hotel not found" });
        }
        await hotel.save();
        res.status(200).send();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
// router.post(
//     "/:hotelId/bookings",
//     verifyToken,
//     async (req: Request, res: Response) => {
//         try {
//             const paymentIntentId = req.body.paymentIntentId;
//             const paymentIntent = await stripe.paymentIntents.retrieve(
//                 paymentIntentId as string
//             );
//             if (!paymentIntent) {
//                 return res.status(400).json({ message: "payment intent not found" });
//             }
//             if (
//                 paymentIntent.metadata.hotelId !== req.params.hotelId ||
//                 paymentIntent.metadata.userId !== req.userId
//             ) {
//                 return res.status(400).json({ message: "payment intent mismatch" });
//             }
//             if (paymentIntent.status !== "succeeded") {
//                 return res.status(400).json({
//                     message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
//                 });
//             }
//             const newBooking: BookingType = {
//                 ...req.body,
//                 userId: req.userId,
//             };
//             const hotel = await Hotel.findOneAndUpdate(
//                 { _id: req.params.hotelId },
//                 {
//                     $push: { bookings: newBooking },
//                 }
//             );
//             if (!hotel) {
//                 return res.status(400).json({ message: "hotel not found" });
//             }
//             await hotel.save();
//             res.status(200).send();
//         } catch (error) {
//             console.log(error);
//             res.status(500).json({ message: "something went wrong" });
//         }
//     }
// );
const constructSearchQuery = (queryParams) => {
    let constructedQuery = {};
    if (queryParams.destination) {
        constructedQuery.$or = [
            { name: new RegExp(queryParams.destination, "i") },
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }
    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }
    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }
    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }
    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }
    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star) => parseInt(star))
            : parseInt(queryParams.stars);
        constructedQuery.starRating = { $in: starRatings };
    }
    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }
    return constructedQuery;
};
exports.default = router;
