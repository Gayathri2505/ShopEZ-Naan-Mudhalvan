import express from 'express';
import { Carts, Orders } from '../models/Schema.js'; // Use Carts and Orders schema
import authenticateJWT from '../middleware/authenticateJWT.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation rules for adding/updating cart items
/*const cartItemValidation = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('mainImg').optional().isURL().withMessage('Main image must be a valid URL'),
    body('size').optional().notEmpty().withMessage('Size is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }).withMessage('Price must be at least 0'),
    body('discount').optional().isNumeric().withMessage('Discount must be a number').isFloat({ min: 0 }).withMessage('Discount must be at least 0'),
];*/

// Add to Cart Route (using Carts schema)
router.post('/add-to-cart', authenticateJWT,  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, title, description, mainImg, size, quantity, price, discount } = req.body;

    try {
        const newCartItem = new Carts({ userId, title, description, mainImg, size, quantity, price, discount });
        await newCartItem.save();
        res.status(201).json(newCartItem);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
});

// Fetch Cart Items Route (using Carts schema)
router.get('/fetch-cart', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    try {
        const items = await Carts.find({ userId: userId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error: error.message });
    }
});

// New Route: Increase Cart Item Quantity
router.put('/increase-cart-quantity', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const { id } = req.body;

    try {
        const item = await Carts.findById(id);
        if (item.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this cart item' });
        }

        item.quantity += 1;
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error increasing item quantity', error: error.message });
    }
});

// New Route: Decrease Cart Item Quantity
router.put('/decrease-cart-quantity', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const { id } = req.body;

    try {
        const item = await Carts.findById(id);
        if (item.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this cart item' });
        }

        if (item.quantity > 1) {
            item.quantity -= 1;
            await item.save();
            res.json(item);
        } else {
            await Carts.findByIdAndDelete(id);
            res.json({ message: 'Item removed from cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error decreasing item quantity', error: error.message });
    }
});

// Remove Item from Cart Route (using Carts schema)
router.delete('/:id', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    try {
        const deletedItem = await Carts.findByIdAndDelete(req.params.id);

        if (deletedItem.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this cart item' });
        }

        res.json({ message: 'Item removed from cart', deletedItem });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
});

// New Route: Place Order (using Orders schema)
/*router.post('/place-cart-order', async(req, res)=>{
    const {userId, name, mobile, email, address, pincode, paymentMethod, orderDate} = req.body;
    try{

        const cartItems = await Carts.find({userId});
        cartItems.map(async (item)=>{

            const newOrder = new Orders({userId, name, email, mobile, address, pincode, title: item.title, description: item.description, mainImg: item.mainImg, size:item.size, quantity: item.quantity, price: item.price, discount: item.discount, paymentMethod, orderDate})
            await newOrder.save();
            await Carts.deleteOne({_id: item._id})
        })
        res.json({message: 'Order placed'});

    }catch(err){
        res.status(500).json({message: "Error occured"});
    }
})*/

router.post('/place-cart-order', async (req, res) => {
    const { userId, items, name, mobile, email, address, pincode, paymentMethod, orderDate } = req.body;

    // Log the request body to see what's coming in
    console.log('Request body:', req.body);

    try {
        // Process only the selected items
        const cartItems = await Carts.find({ userId, '_id': { $in: items.map(item => item._id) } });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'No valid items to order.' });
        }

        cartItems.forEach(async (item) => {
            const newOrder = new Orders({
                userId,
                name,
                email,
                mobile,
                address,
                pincode,
                title: item.title,
                description: item.description,
                mainImg: item.mainImg,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount,
                paymentMethod,
                orderDate,
            });

            // Log the new order being created
            console.log('Creating Order:', newOrder);

            // Save the new order
            await newOrder.save();

            // Remove the item from the cart after placing the order
            await Carts.deleteOne({ _id: item._id });
        });

        res.json({ message: 'Order placed successfully for selected items.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error occurred while placing the order" });
    }
});



export default router;
