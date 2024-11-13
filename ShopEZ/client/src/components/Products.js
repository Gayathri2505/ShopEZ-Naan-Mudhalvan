import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Customer/Product.css';
import ProductFilters from './ProductFilters';

const Products = ({ products: initialProducts, category }) => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState(initialProducts || []);
    const [visibleProducts, setVisibleProducts] = useState(initialProducts || []);
    const [productsToShow, setProductsToShow] = useState(8);

    const [sortFilter, setSortFilter] = useState('popularity');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [genderFilter, setGenderFilter] = useState([]);

    const [cart, setCart] = useState([]);
    const [selectedSize, setSelectedSize] = useState('');
    const [showSizePopup, setShowSizePopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { updateCartCount } = useContext(AuthContext);

    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set()); 
    const userId = sessionStorage.getItem('userId');

    // Ref to the products container for scroll event
    const productsContainerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:3001/api/products/fetch-products');
            if (category === 'all') {
                setProducts(response.data);
                setVisibleProducts(response.data);
            } else {
                const filteredProducts = response.data.filter(product => product.category === category);
                setProducts(filteredProducts);
                setVisibleProducts(filteredProducts);
            }

            const categoriesResponse = await axios.get('http://localhost:3001/api/products/fetch-categories');
            setCategories(categoriesResponse.data);
        };

        if (!initialProducts) {
            fetchData();
        } else {
            setProducts(initialProducts);
            setVisibleProducts(initialProducts);
        }
    }, [initialProducts, category]);

    const handleAddToCart = async (e, product) => {
        e.stopPropagation();
        if (product.sizes && product.sizes.length > 0) {
            setSelectedProduct(product);
            setShowSizePopup(true);
        } else {
            await addToCart(product, product.sizes[0]);
            alert('Product added to Cart');
            updateCartCount();
        }
    };

    const addToCart = async (product, size) => {
        const userId = sessionStorage.getItem('userId');
        const token = sessionStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3001/api/cart/add-to-cart', {
                userId,
                title: product.title,
                description: product.description,
                mainImg: product.mainImg,
                size,
                quantity: 1,
                price: product.price,
                discount: product.discount,
            }, { headers: { Authorization: `Bearer ${token}` } });
            setCart([...cart, response.data]);
            setShowSizePopup(false);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const handleSizeSelection = (size) => {
        setSelectedSize(size);
    };

    const handleConfirmAddToCart = () => {
        if (selectedProduct && selectedSize) {
            addToCart(selectedProduct, selectedSize);
            alert('Product added to Cart');
        }
    };

    const handleCategoryCheckBox = (e) => {
        const value = e.target.value;
        setCategoryFilter(e.target.checked ? [...categoryFilter, value] : categoryFilter.filter(size => size !== value));
    };

    const handleGenderCheckBox = (e) => {
        const value = e.target.value;
        setGenderFilter(e.target.checked ? [...genderFilter, value] : genderFilter.filter(size => size !== value));
    };

    const handleSortFilterChange = (e) => {
        const value = e.target.value;
        setSortFilter(value);
        setVisibleProducts([...visibleProducts].sort((a, b) =>
            value === 'low-price' ? a.price - b.price :
                value === 'high-price' ? b.price - a.price :
                    value === 'discount' ? b.discount - a.discount : visibleProducts));
    };

    useEffect(() => {
        setVisibleProducts(
            products.filter(product =>
                (categoryFilter.length === 0 || categoryFilter.includes(product.category)) &&
                (genderFilter.length === 0 || genderFilter.includes(product.gender))
            )
        );
    }, [categoryFilter, genderFilter, products]);

    const clearFilters = () => {
        setCategoryFilter([]);
        setGenderFilter([]);
        setSortFilter('');
    };

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/wishlist/${userId}`);
                const wishlistProductIds = new Set(response.data.map(product => product._id));
                setWishlist(response.data);
                setWishlistIds(wishlistProductIds);
            } catch (error) {
                console.error('Error fetching wishlist', error);
            }
        };
        if (userId) fetchWishlist();
    }, [userId]);

    // Handle Add/Remove from Wishlist
    const toggleWishlist = async (productId) => {
        try {
            const inWishlist = wishlistIds.has(productId);
            if (inWishlist) {
                await axios.post(`http://localhost:3001/api/wishlist/${userId}/remove`, { productId });
                setWishlist(wishlist.filter(p => p._id !== productId));
                setWishlistIds(prev => new Set([...prev].filter(id => id !== productId)));
            } else {
                await axios.post(`http://localhost:3001/api/wishlist/${userId}/add`, { productId });
                setWishlist([...wishlist, { _id: productId }]);
                setWishlistIds(prev => new Set(prev).add(productId));
            }
        } catch (error) {
            console.error('Error toggling wishlist', error);
        }
    };

    const handleLoadMore = () => {
        // Check remaining products and add as many as are left
        const remainingProducts = products.length - productsToShow;
        const productsToLoad = remainingProducts < 8 ? remainingProducts : 8;
        setProductsToShow(prev => prev + productsToLoad);
    };

    // Scroll event handler for infinite scroll within products container
    useEffect(() => {
        const handleScroll = () => {
            const container = productsContainerRef.current;
            if (container) {
                const bottom = Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight;
                if (bottom) {
                    handleLoadMore();
                }
            }
        };

        const container = productsContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [productsToShow]);

    return (
        <div className="products-container">
            <ProductFilters
                categories={categories}
                categoryFilter={categoryFilter}
                genderFilter={genderFilter}
                sortFilter={sortFilter}
                handleCategoryCheckBox={handleCategoryCheckBox}
                handleGenderCheckBox={handleGenderCheckBox}
                handleSortFilterChange={handleSortFilterChange}
                clearFilters={clearFilters}
            />

            <div className="products-body">
                <h3>All Products</h3>
                <div className="products" ref={productsContainerRef}>
                    {visibleProducts.slice(0, productsToShow).map((product) => (
                        <div className='product-item' key={product._id}>
                            <div className="product" onClick={() => navigate(`/product/${product._id}`)}>
                                <img src={product.mainImg} alt="" />
                                <div className="wishlist-icon" onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWishlist(product._id);
                                }}>
                                    <i className={`fas fa-heart ${wishlistIds.has(product._id) ? 'filled' : ''}`}></i>
                                </div>
                                <div className="product-data">
                                    <h6>{product.title}</h6>
                                    <p>{product.description.slice(0, 30) + '....'}</p>
                                    <h5>&#8377; {parseInt(product.price - (product.price * product.discount) / 100)} <s>{product.price}</s><p>( {product.discount}% off)</p></h5>
                                </div>
                                <div className="cart-icon-prod" onClick={(e) => handleAddToCart(e, product)}>
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showSizePopup && (
                <div className="size-popup">
                    <h4>Select Size</h4>
                    <div className="sizes">
                        {selectedProduct && selectedProduct.sizes.map((size) => (
                            <button
                                key={size}
                                className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                onClick={() => handleSizeSelection(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <div className="popup-actions">
                        <button className="popup-button cancel-button" onClick={() => setShowSizePopup(false)}>Cancel</button>
                        <button className="popup-button add-button" onClick={handleConfirmAddToCart}>Add to Cart</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
