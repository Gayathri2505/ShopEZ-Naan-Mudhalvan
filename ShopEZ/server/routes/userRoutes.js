import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/Schema.js';
import { body, validationResult } from 'express-validator';
import authenticateJWT from '../middleware/authenticateJWT.js';

const router = express.Router();

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET; // Use a strong secret key

console.log(JWT_SECRET);
// Input validation
/*const userValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('usertype').notEmpty().withMessage('User type is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
*/
// Register User
router.post('/register', async (req, res) => {
    const { username, email, password,usertype } = req.body;

  /*  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }*/

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, usertype, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', user: newUser, token });
    } catch (error) {
        console.error('Error creating user:', error);  // This should log the error
        res.status(500).json({ message: 'Error creating user', error });  // Send error details back to the client
    }
    
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).lean();
        console.log("User data before token generation:", user);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Ensure the `usertype` is included in the payload
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                usertype: user.usertype // Ensure usertype is included here
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', user, token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Fetch All Users (Protected Route)
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const users = await User.find().lean();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});


// Fetch All Users (Protected Route)
router.get('/fetch-users', authenticateJWT, async (req, res) => {
    try {
        const users = await User.find({ usertype: { $ne: 'admin' } }).lean(); // Exclude admins
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

export default router;


