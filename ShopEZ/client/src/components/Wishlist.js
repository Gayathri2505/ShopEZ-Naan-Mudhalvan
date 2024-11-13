import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import '../styles/Customer/Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const userId = sessionStorage.getItem('userId');
  const [cart, setCart] = useState([]);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const { updateCartCount } = useContext(AuthContext);

  // Fetch the wishlist from the API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/wishlist/${userId}`);
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist', error);
      }
    };
    fetchWishlist();
  }, [userId]);

  // Function to add product to cart
  const addToCart = async (product, size) => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:3001/api/cart/add-to-cart',
        {
          userId,
          title: product.title,
          description: product.description,
          mainImg: product.mainImg,
          size,
          quantity: 1,
          price: product.price,
          discount: product.discount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart([...cart, response.data]);
      setShowSizePopup(false);
      updateCartCount();
      alert('Product added to cart!');
      // After adding to cart, remove it from wishlist
      await removeFromWishlist(product._id);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  // Function to remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/wishlist/${userId}/remove`, { productId });
      setWishlist(response.data.products); // Update the wishlist after removal
    } catch (error) {
      console.error('Error removing from wishlist', error);
    }
  };

  // Handle the click of the "Move to Cart" button
  const handleMoveToCart = (e, product) => {
    e.stopPropagation();
    if (product.sizes && product.sizes.length > 0) {
      setSelectedProduct(product);
      setShowSizePopup(true); // Show size selection (if needed)
    } else {
      addToCart(product, product.sizes[0]); // Add directly if no size selection is needed
    }
  };

  // Handle size selection
  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="wishlist-empty-message">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="wishlist-card">
              <img src={product.mainImg} alt={product.title} className="wishlist-card-image" />
              <div className="wishlist-card-info">
                <h2 className="wishlist-card-title">{product.title}</h2>
                <p className="wishlist-card-description">{product.description}</p>
                <button
                  className="wishlist-remove-button"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  Remove
                </button>
                <button
                  className="wishlist-move-to-cart-button"
                  onClick={(e) => handleMoveToCart(e, product)}
                >
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Size selection popup */}
      {showSizePopup && selectedProduct && (
        <div className="size-popup">
          <h4>Select Size for {selectedProduct.title}</h4>
          <div className="sizes">
            {selectedProduct.sizes.map((sizeOption) => (
              <button
                key={sizeOption}
                className={`size-option ${selectedSize === sizeOption ? 'active' : ''}`}
                onClick={() => handleSizeSelection(sizeOption)}
              >
                {sizeOption}
              </button>
            ))}
          </div>
          <div className="popup-actions">
            <button className="popup-button cancel-button" onClick={() => setShowSizePopup(false)}>
              Cancel
            </button>
            <button
              className="popup-button add-button"
              onClick={() => {
                if (selectedSize) {
                  addToCart(selectedProduct, selectedSize);
                }
              }}
              disabled={!selectedSize}
            >
              Move to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
