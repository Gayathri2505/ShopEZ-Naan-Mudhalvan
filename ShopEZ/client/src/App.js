import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Profile from './pages/customer/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AllUsers from './pages/admin/AllUsers';
import AllProducts from './pages/admin/AllProducts';
import AllOrders from './pages/admin/AllOrders';
import NewProduct from './pages/admin/NewProduct';
import UpdateProduct from './pages/admin/UpdateProduct';
import IndividualProduct from './pages/customer/IndividualProducts';
import CategoryProducts from './pages/customer/CategoryProducts';
import SearchResults from './components/SearchResults';
import Products from './components/Products';
import Cart from './pages/customer/Cart';
import Wishlist from './components/Wishlist';

import './index.css';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path='/product/:id' element={<IndividualProduct />} />
                    <Route path='/category/:category' element={<CategoryProducts />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/wishlist' element={<Wishlist />} />
                    <Route path="/" element={<Products category="all" />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/forgot-password" element={<Login />} />
                    <Route path="/reset-password" element={<Login />} />


                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/all_users" element={<AllUsers />} />
                    <Route path="/all_products" element={<AllProducts />} />
                    <Route path="/all_orders" element={<AllOrders />} />
                    <Route path="/new_product" element={<NewProduct />} />
                    <Route path="/update-product/:id" element={<UpdateProduct />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
