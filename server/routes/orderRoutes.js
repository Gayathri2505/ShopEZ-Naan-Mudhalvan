import express from 'express';
import { Orders } from '../models/Schema.js';
import authenticateJWT from '../middleware/authenticateJWT.js'; // Import JWT middleware
import { body, validationResult } from 'express-validator'; // Import express-validator for validation

const router = express.Router();

// Validation rules for placing an order
/*const orderValidation = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('mobile').optional().isString().withMessage('Mobile must be a string'),
    body('address').notEmpty().withMessage('Address is required'),
    body('pincode').notEmpty().isString().withMessage('Pincode is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('mainImg').optional().isURL().withMessage('Main image must be a valid URL'),
    body('size').notEmpty().withMessage('Size is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }).withMessage('Price must be at least 0'),
    body('discount').optional().isNumeric().withMessage('Discount must be a number').isFloat({ min: 0 }).withMessage('Discount must be at least 0'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
    body('orderDate').optional().isISO8601().withMessage('Order date must be a valid date'),
];*/

// Place Order
router.post('/buy-product', authenticateJWT, async (req, res) => {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, name, email, mobile, address, pincode, title, description, mainImg, size, quantity, price, discount, paymentMethod, orderDate } = req.body;

    try {
        const newOrder = new Orders({ userId, name, email, mobile, address, pincode, title, description, mainImg, size, quantity, price, discount, paymentMethod, orderDate });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});

// Fetch All Orders
router.get('/fetch-orders', authenticateJWT, async (req, res) => { // Protect this route
    try {
        const orders = await Orders.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

//sepcifi user's
router.get('/:id', authenticateJWT, async (req, res) => { // Protect this route
    try {
        const orders = await Orders.find({ userId: req.user.id }); // Ensure only user's orders are fetched
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Update Order Status
router.put('/update-order-status', authenticateJWT, async (req, res) => {
    const {id, updateStatus} = req.body;
    try {

        const updatedOrder = await Orders.findById(id, { new: true });
        updatedOrder.orderStatus=updateStatus;
        await updatedOrder.save();
        
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({message: 'order status updated'});
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

// Delete a Placed Order
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const deletedOrder = await Orders.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully', deletedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
});

router.put('/cancel-order', async (req, res) => {
    const { id } = req.body;
    try {
        const order = await Orders.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.orderStatus = 'cancelled';
        await order.save();
        res.json({ message: 'Order cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error occurred" });
    }
});

export default router;