import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken, { cacheMiddleware } from "../middleware/auth";
import { memoize } from "lodash";
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

import redisClient from "../utils/redis";

const router = express.Router();

const memoizedFetchHotels = memoize(async function () {
    try {
        const hotels = await Hotel.find().sort("-lastUpdated");
        return hotels;
    } catch (error) {
        console.log("Error fetching hotels:", error);
        throw error; // Propagate error to caller
    }
});

router.get("/search", cacheMiddleware, async (req: Request, res: Response) => {
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
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;

        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await Hotel.countDocuments(query);

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };

        res.json(response);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.get('/search/suggestion/:query' , cacheMiddleware, async (req: Request, res: Response) => {
    let query = req.params.query; // Get the search query from the URL
    console.log('Search Query:', query); // Check the value of query

    try {
        let hotels = await Hotel.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { city: { $regex: query, $options: "i" } },
                { country: { $regex: query, $options: "i" } },
            ],
        }).limit(5);

        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error searching hotels:', error); // Log any errors

        res.status(500).json({ message: "Error searching hotels" });
    }
});


// with redis on local it is giving 250ms to 5,4 ms 
router.get("/", async (req: Request, res: Response) => {
    try {
        // Check if data exists in Redis cache
        const cachedHotels = await redisClient.get('all_hotels');
        
        if (cachedHotels) {
            // If cached data exists, return it
            console.log('Returning data from Redis cache');
            return res.json(JSON.parse(cachedHotels));
        }

        // If not in cache, fetch from MongoDB
        const hotels = await Hotel.find().sort("-lastUpdated");

        // Store the fetched data in Redis cache
        await redisClient.set('all_hotels', JSON.stringify(hotels), {
            EX: 3600 // Set expiration to 1 hour (3600 seconds)
        });

        console.log('Data fetched from MongoDB and cached in Redis');
        res.json(hotels);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Error fetching hotels" });
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

// Route handler with memoized function

// router.get("/", async (req, res) => {
//     try {
//         const hotels = await memoizedFetchHotels(); // Use memoized function
//         res.json(hotels);
//     } catch (error) {
//         console.log("Error in route handler:", error);
//         res.status(500).json({ message: "Error fetching hotels" });
//     }
// });

router.get(
    "/:id",
    [param("id").notEmpty().withMessage("Hotel ID is required")],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id.toString();

        try {
            const hotel = await Hotel.findById(id);
            res.json(hotel);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error fetching hotel" });
        }
    }
);

router.post(
    "/:hotelId/bookings/payment-intent",
    verifyToken,
    async (req: Request, res: Response) => {
        const { numberOfNights } = req.body;
        const hotelId = req.params.hotelId;
        const userId = req.userId;

        const hotel = await Hotel.findById(hotelId);
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
    }
);

router.post(
    "/:hotelId/bookings",
    verifyToken,
    async (req: Request, res: Response) => {
        try {
            const paymentIntentId = req.body.paymentIntentId;

            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId as string
            );

            if (!paymentIntent) {
                return res.status(400).json({ message: "payment intent not found" });
            }

            if (
                paymentIntent.metadata.hotelId !== req.params.hotelId ||
                paymentIntent.metadata.userId !== req.userId
            ) {
                return res.status(400).json({ message: "payment intent mismatch" });
            }

            if (paymentIntent.status !== "succeeded") {
                return res.status(400).json({
                    message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
                });
            }

            const newBooking: BookingType = {
                ...req.body,
                userId: req.userId,
            };

            const hotel = await Hotel.findOneAndUpdate(
                { _id: req.params.hotelId },
                {
                    $push: { bookings: newBooking },
                }
            );

            if (!hotel) {
                return res.status(400).json({ message: "hotel not found" });
            }

            await hotel.save();
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "something went wrong" });
        }
    }
);

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

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
            ? queryParams.stars.map((star: string) => parseInt(star))
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

export default router; 