"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const hotel_1 = __importDefault(require("../models/hotel"));
const auth_1 = __importDefault(require("../middleware/auth"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
router.post("/", auth_1.default, [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("City is required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("Country is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required"),
    (0, express_validator_1.body)("type").notEmpty().withMessage("Hotel type is required"),
    (0, express_validator_1.body)("pricePerNight")
        .notEmpty()
        .isNumeric()
        .withMessage("Price per night is required and must be a number"),
    (0, express_validator_1.body)("facilities")
        .notEmpty()
        .isArray()
        .withMessage("Facilities are required"),
], upload.array("imageFiles", 6), async (req, res) => {
    try {
        const imageFiles = req.files;
        const newHotel = req.body;
        //1. upload images to cloudinary
        const imageUrls = await uploadImages(imageFiles);
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;
        //2. if upload was successful, add the urls to the new hotel
        //3. save the hotel to the database
        const hotel = new hotel_1.default(newHotel);
        await hotel.save();
        //4. return a 201 status code
        res.status(201).send(hotel);
    }
    catch (error) {
        console.log("Error creating hotel:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.get("/", auth_1.default, async (req, res) => {
    try {
        const hotels = await hotel_1.default.find({ userId: req.userId });
        res.json(hotels);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
});
router.get("/:id", auth_1.default, async (req, res) => {
    const id = req.params.id.toString();
    try {
        const hotel = await hotel_1.default.findOne({
            _id: id,
            userId: req.userId,
        });
        res.json(hotel);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
});
router.put("/:hotelId", auth_1.default, upload.array("imageFiles"), async (req, res) => {
    try {
        const updatedHotel = req.body;
        updatedHotel.lastUpdated = new Date();
        const hotel = await hotel_1.default.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,
        }, updatedHotel, { new: true });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const files = req.files;
        const updatedImageUrls = await uploadImages(files);
        hotel.imageUrls = [
            ...updatedImageUrls,
            ...(updatedHotel.imageUrls || []),
        ];
        await hotel.save();
        res.status(201).json(hotel);
    }
    catch (error) {
        res.status(500).json({ message: "Something went throw" });
    }
});
async function uploadImages(imageFiles) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary_1.default.v2.uploader.upload(dataURI);
        return res.url;
    });
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}
exports.default = router;
