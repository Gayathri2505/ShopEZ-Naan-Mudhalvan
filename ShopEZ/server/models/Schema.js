import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true }
});

const adminSchema = new mongoose.Schema({
    banner: { type: String },
    categories: { type: Array }
});

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    mainImg: { type: String },
    carousel: { type: Array },
    sizes: { type: Array },
    category: { type: String },
    gender: { type: String },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, min: 0 }
})

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String },
    address: { type: String },
    pincode: { type: String },
    title: { type: String },
    description: { type: String },
    mainImg: { type: String },
    size: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, min: 0 },
    paymentMethod: { type: String },
    orderDate: { type: String, default: Date.now },
    deliveryDate: { type: String },
    orderStatus: { type: String, default: 'order placed' }
})

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    title: { type: String, required: true },
    description: { type: String },
    mainImg: { type: String },
    size: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, min: 0 }
})

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }]
})


export const User = mongoose.model('users', userSchema);
export const Admin = mongoose.model('admin', adminSchema);
export const Product = mongoose.model('products', productSchema);
export const Orders = mongoose.model('orders', orderSchema);
export const Carts = mongoose.model('cart', cartSchema);
export const Wishlist = mongoose.model('wishlist', wishlistSchema);
