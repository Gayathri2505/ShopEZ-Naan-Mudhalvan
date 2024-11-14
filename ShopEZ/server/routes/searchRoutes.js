import express from 'express';
import { Product } from '../models/Schema.js';

const router = express.Router();

// Search route
router.get("/", async (req, res) => {
    const query = req.query.query;

    // Validate query
    if (!query || query.trim().length === 0) {
        return res.status(400).json({ message: "Query parameter is required." });
    }

    try {
        // Use regex to search titles and category names, case-insensitive
        const results = await Product.find({
            $or: [
                { title: { $regex: new RegExp(query, 'i') } },
                { description: { $regex: new RegExp(query, 'i') } },
                { category: { $regex: new RegExp(query, 'i') } }
            ]
        }).limit(50);

        res.json(results);
    } catch (error) {
        console.error("Error fetching search results:", error);
        res.status(500).json({ message: "Failed to fetch search results" });
    }
});

export default router;
