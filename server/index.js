import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import authRoutes from './routes/authRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';


dotenv.config({path:"./.env"});

const app=express();
app.use(express.json());
app.use(cors());

const mongo_uri=process.env.MONGO_URI;
const PORT=process.env.PORT;

const connectMongo=async () => {
    try {
        await mongoose.connect(mongo_uri);
        console.log("Successfully connected to Database");
    } catch (error) {
        console.log("Database Connection Error:",error.message);
        process.exit(1);
    }
};

connectMongo();

app.get('/', (req, res) => {
    res.send('Server is Running at port 3001');
});

//Routes to pages
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/forgot',authRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Graceful shutdown
const shutdown = async () => {
    try {
        await mongoose.connection.close();
        console.log('Mongoose connection disconnected');
        process.exit(0);
    } catch (err) {
        console.error('Error while closing mongoose connection:', err);
        process.exit(1);
    }
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.listen(PORT, () => {
    console.log("App server running on port 3001");
});
