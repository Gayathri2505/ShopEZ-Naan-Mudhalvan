import express from "express";
import { Wishlist } from '../models/Schema.js';

const router = express.Router();

router.post('/:userId/add', async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;
    try {
        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $addToSet: { products: productId } },
            { new: true, upsert: true }
        );
        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Error adding to wishlist', error: err });
    }
});

// Remove product from wishlist
router.post('/:userId/remove', async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;
    try {
        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { products: productId } },
            { new: true }
        );
        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Error removing from wishlist', error: err });
    }
});

// Get user wishlist
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const wishlist = await Wishlist.findOne({ userId }).populate('products');
        //console.log(wishlist);

        res.status(200).json(wishlist ? wishlist.products : []);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching wishlist', error: err });
    }
});

export default router;
