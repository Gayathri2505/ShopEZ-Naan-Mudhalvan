import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import OrderList from "../../components/OrderList";
import AuthContext, { useAuth } from "../../context/AuthContext";
import defaultProfileImage from "../../images/default_profile.jpg";
import "../../styles/Customer/Profile.css";

const Profile = () => {
    const { loading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [cartItems, setCartItems] = useState([]); // State for cart items
    const [wishlistItems, setWishlist] = useState([]); // State for wishlist items
    const [error, setError] = useState('');
    const { user, isAuthenticated } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('active'); // Active tab for orders
    const navigate = useNavigate(); // For navigation

    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    // Fetch orders for the authenticated user
    useEffect(() => {
        const fetchOrders = async (userId) => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:3001/api/orders/${userId}`, {
                        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                    });
                    setOrders(response.data);
                } catch (error) {
                    setError("Failed to fetch orders");
                }
            }
        };

        const fetchWishlist = async () => {

            try {
                const response = await axios.get(`http://localhost:3001/api/wishlist/${userId}`);
                setWishlist(response.data);
            } catch (error) {
                console.error('Error fetching wishlist', error);
            }
        };

        const fetchCart = async () => {

            if (userId) {
                const response = await axios.get('http://localhost:3001/api/cart/fetch-cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCartItems(response.data.filter((item) => item.userId === userId).reverse());
            }
        };

        if (user) {
            fetchOrders(user._id);
            fetchWishlist();
            fetchCart();
        }
    }, [user,userId,token]); // Re-run when `user` changes

    const handleCancelOrder = async (orderId) => {
        try {
            const confirmCancel = window.confirm("Do you want to cancel the order?");
            if (confirmCancel) {
                const response = await axios.put(`http://localhost:3001/api/orders/cancel-order`, { id: orderId });

                if (response.data.message === 'Order cancelled successfully') {
                    setOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order._id === orderId ? { ...order, orderStatus: "cancelled" } : order
                        )
                    );
                }

            } else {
                alert('Item not removed from cart');
            }
        } catch (error) {
            setError("Failed to cancel the order. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;

    // Filter orders based on their status
    const activeOrders = orders.filter(order => order.orderStatus === "order placed" || order.orderStatus === "In-transit");
    const completedOrders = orders.filter(order => order.orderStatus === "delivered");
    const cancelledOrders = orders.filter(order => order.orderStatus === "cancelled");

    // Display items (cart and wishlist)
    const displayItems = (items) => {
        return items.slice(0, 3).map((item, index) => (
            <div className="item-card" key={index}>
                <img src={item.mainImg} alt={item.title} className="item-image" />
                <p>&#8377;{`${item.price.toFixed(2)}`}</p>
            </div>
        ));
    };

    return (
        <div className="profile-page">
            <div className="page-container">
                <div className="profile-container">
                    {isAuthenticated && user ? (
                        <>
                            <div className="profile-info">
                                <img
                                    src={user?.profilePicture || defaultProfileImage}
                                    alt="Profile"
                                    className="profile-pic"
                                />
                                <h2>{user?.username}</h2>
                                <p>{user?.email}</p>
                            </div>

                            {/* Space below the profile info */}
                            <div className="order-section-container">
                                <div className="order-buttons">
                                    <button
                                        className={`order-button ${activeTab === 'active' ? 'active active-orders' : ''}`}
                                        onClick={() => setActiveTab('active')}
                                    >
                                        Active Orders
                                    </button>
                                    <button
                                        className={`order-button ${activeTab === 'completed' ? 'active completed-orders' : ''}`}
                                        onClick={() => setActiveTab('completed')}
                                    >
                                        Completed Orders
                                    </button>
                                    <button
                                        className={`order-button ${activeTab === 'cancelled' ? 'active cancelled-orders' : ''}`}
                                        onClick={() => setActiveTab('cancelled')}
                                    >
                                        Cancelled Orders
                                    </button>
                                </div>

                                <div className="order-section">
                                    {error && <p className="error-message">{error}</p>}

                                    {activeTab === 'active' && (
                                        <OrderList title="Active" orders={activeOrders} onCancelOrder={handleCancelOrder} />
                                    )}

                                    {activeTab === 'completed' && (
                                        <OrderList title="Completed" orders={completedOrders} />
                                    )}

                                    {activeTab === 'cancelled' && (
                                        <OrderList title="Cancelled" orders={cancelledOrders} />
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Please log in to view your profile.</p>
                    )}

                    {/* Cart and Wishlist Section */}
                    <div className="cart-wishlist-container">
                        <div className="cart-section">
                            <h3>Your Cart</h3>
                            <div className="cart-items">
                                {displayItems(cartItems)}
                                {cartItems.length > 3 && (
                                    <div className="view-more-container">
                                    <span className="view-more" onClick={() => navigate('/cart')}>
                                        View More
                                    </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="wishlist-section">
                            <h3>Your Wishlist</h3>
                            <div className="wishlist-items">
                                {displayItems(wishlistItems)}
                                {wishlistItems.length > 3 && (
                                    <div className="view-more-container">
                                    <span className="view-more" onClick={() => navigate('/wishlist')}>
                                        View More
                                    </span>
                                </div>
                                
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
