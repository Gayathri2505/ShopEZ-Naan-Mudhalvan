import express from 'express';
import { Product } from '../models/Schema.js';
import { body, validationResult } from 'express-validator';
import authenticateJWT from '../middleware/authenticateJWT.js'; // Middleware for JWT authentication

const router = express.Router();

// Create Product
router.post('/', authenticateJWT,async (req, res) => {
    const { title, description, mainImg,carousel, sizes, category, gender, price, discount } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newProduct = new Product({ title, description, mainImg,carousel, sizes, category, gender, price, discount });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// Get All Products
router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Pagination
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    try {
        const products = await Product.find().limit(options.limit).skip((options.page - 1) * options.limit);
        const totalProducts = await Product.countDocuments();
        res.json({ totalProducts, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

router.get('/fetch-products', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// Get Product by ID
router.get('/fetch-product-details/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// Update Product
router.put('/update-product/:id', authenticateJWT,async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// Delete Product
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});


// Fetch Unique Categories from Products
router.get('/fetch-categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category'); // Fetch unique categories
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error); // Log the error details
        res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
});

export default router;
