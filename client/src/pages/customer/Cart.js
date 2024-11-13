import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Checkout from '../../components/Checkout';
import Footer from '../../components/Footer';
import AuthContext from "../../context/AuthContext";
import '../../styles/Customer/Cart.css';

const Cart = () => {
    const { updateCartCount } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); 
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    // Wrap fetchCart in useCallback to prevent unnecessary re-renders
    const fetchCart = useCallback(async () => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            const response = await axios.get('http://localhost:3001/api/cart/fetch-cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data.filter((item) => item.userId === userId).reverse());
        }
    }, [token]);  // Add token as dependency

    // Wrap calculateTotalPrice in useCallback to prevent unnecessary re-renders
    const calculateTotalPrice = useCallback(() => {
        const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item._id));  // Filter selected items
        const totalPrice = selectedCartItems.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const discount = selectedCartItems.reduce((sum, product) => sum + ((product.price * product.discount) / 100) * product.quantity, 0);
        setTotalPrice(totalPrice);
        setTotalDiscount(Math.floor(discount));
        setDeliveryCharges(totalPrice > 1000 ? 0 : 50);
    }, [cartItems, selectedItems]);  // Add cartItems and selectedItems as dependencies

    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(itemId)) {
                return prevSelectedItems.filter((id) => id !== itemId);  // Unselect if already selected
            } else {
                return [...prevSelectedItems, itemId];  // Select if not already selected
            }
        });
    };

    const increaseQuantity = async (id) => {
        await axios
            .put(`http://localhost:3001/api/cart/increase-cart-quantity`, { id }, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => fetchCart())
            .catch((err) => console.error('Failed to increase quantity:', err));
    };

    const decreaseQuantity = async (id, quantity) => {
        if (quantity > 1) {
            await axios
                .put(`http://localhost:3001/api/cart/decrease-cart-quantity`, { id }, { headers: { Authorization: `Bearer ${token}` } })
                .then(() => fetchCart())
                .catch((err) => console.error('Failed to decrease quantity:', err));
        } else {
            removeItem(id);
        }
    };

    const removeItem = async (id) => {
        const confirmRemove = window.confirm('Do you want to remove the item from the cart?'); // Ask the user if they want to proceed

        if (confirmRemove) {
            try {
                await axios.delete(`http://localhost:3001/api/cart/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchCart();
                updateCartCount();
                alert('Item removed from cart');
            } catch (err) {
                console.error('Failed to remove item:', err);
                alert('Failed to remove item');
            }
        } else {
            alert('Item not removed from cart');
        }
    };

    useEffect(() => {
        calculateTotalPrice(); // Recalculate price when selectedItems or cartItems change
    }, [selectedItems, cartItems, calculateTotalPrice]); // Add calculateTotalPrice as a dependency

    useEffect(() => {
        fetchCart(); // Fetch cart items on initial load
    }, [fetchCart]); // Add fetchCart as a dependency

    const placeOrder = async () => {
        const userId = sessionStorage.getItem('userId');

        // Log selected items and payload
        const itemsToOrder = cartItems.filter((item) => selectedItems.includes(item._id));
        console.log('Items to Order:', itemsToOrder);

        if (itemsToOrder.length > 0) {
            const payload = {
                userId,
                items: itemsToOrder,
                name,
                mobile,
                email,
                address,
                pincode,
                paymentMethod,
                totalPrice,
                totalDiscount,
                deliveryCharges,
                orderDate: new Date(),
            };

            // Log the payload being sent to the backend
            //console.log('Payload for Order:', payload);

            try {
                await axios.post('http://localhost:3001/api/cart/place-cart-order', payload);
                alert('Order placed successfully!');
                setSelectedItems([]); // Clear selected items after successful order
                setName('');
                setMobile('');
                setEmail('');
                setAddress('');
                setPincode('');
                setPaymentMethod('');
                fetchCart(); // Reload cart to reflect ordered items
                updateCartCount();
                navigate('/');
            } catch (error) {
                console.error('Failed to place order:', error);
                alert('Failed to place order');
            }
        } else {
            alert("Please select items to order.");
        }
    };

    return (
        <div>
            <div className="cartPage">
                <div className="cartContents">
                    {cartItems.length === 0 ? (
                        <p style={{ textAlign: 'center', marginTop: '20vh' }}>Cart is empty...</p>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cartItem" key={item._id}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item._id)}
                                    onChange={() => handleCheckboxChange(item._id)}
                                />
                                <img src={item.mainImg} alt="" />

                                {/* New container for quantity controls */}
                                <div className="cartItem-controls-below-image">
                                    <button onClick={() => decreaseQuantity(item._id, item.quantity)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increaseQuantity(item._id)}>+</button>
                                </div>

                                <div className="cartItem-data">
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                    <h5 className="cartItem-data-price">
                                        Price: &#8377; {parseInt(item.price - (item.price * item.discount) / 100) * item.quantity}
                                    </h5>
                                    <button className="btn" onClick={() => removeItem(item._id)}>Remove</button>
                                </div>
                            </div>

                        ))
                    )}
                </div>
                <div className="cartPriceBody">
                    <h4>Price Details (Selected Items)</h4>
                    <span><b>Total MRP:</b> <p>&#8377; {totalPrice}</p></span>
                    <span><b>Discount on MRP:</b> <p style={{ color: 'rgb(7, 156, 106)' }}> - &#8377; {totalDiscount}</p></span>
                    <span><b>Delivery Charges:</b> <p style={{ color: 'red' }}> + &#8377; {deliveryCharges}</p></span>
                    <hr />
                    <h5><b>Final Price:</b> &#8377; {totalPrice - totalDiscount + deliveryCharges}</h5>
                    <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" disabled={selectedItems.length === 0}>Place Order</button>
                </div>

                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <Checkout
                        name={name} setName={setName}
                        mobile={mobile} setMobile={setMobile}
                        email={email} setEmail={setEmail}
                        address={address} setAddress={setAddress}
                        pincode={pincode} setPincode={setPincode}
                        paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                        onBuyNow={placeOrder}
                    />
                </div>

            </div>
            <Footer />

        </div>
    );
};

export default Cart;
