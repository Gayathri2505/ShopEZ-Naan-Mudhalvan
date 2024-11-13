import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import '../../styles/Admin/NewAndUpdateProduct.css';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State to hold product details
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productMainImg, setProductMainImg] = useState('');
    const [productCarousel, setProductCarousel] = useState(['', '', '']);
    const [productSizes, setProductSizes] = useState([]);
    const [productGender, setProductGender] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productNewCategory, setProductNewCategory] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDiscount, setProductDiscount] = useState(0);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [ setErrorMessage] = useState(''); // State for error messages

    
    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/products/fetch-categories');
            setAvailableCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch product details
    const fetchProduct =useCallback( async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/products/fetch-product-details/${id}`);
            const data = response.data;
            setProductName(data.title);
            setProductDescription(data.description);
            setProductMainImg(data.mainImg);
            setProductCarousel(data.carousel || ['', '', '']); // Ensure default value if carousel is empty
            setProductSizes(data.sizes || []); // Ensure default value
            setProductGender(data.gender || ''); // Ensure default value
            setProductCategory(data.category || ''); // Ensure default value
            setProductPrice(data.price || 0); // Ensure default value
            setProductDiscount(data.discount || 0); // Ensure default value
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    },[id]);

    useEffect(() => {
        fetchCategories();
        fetchProduct();
    }, [fetchProduct]);


    // Handle checkbox updates
    const handleCheckBox = (e) => {
        const value = e.target.value;
        setProductSizes((prevSizes) =>
            e.target.checked ? [...prevSizes, value] : prevSizes.filter((size) => size !== value)
        );
    };

    const handleCarouselChange = (e, idx) => {
        const newCarousel = [...productCarousel];
        newCarousel[idx] = e.target.value;
        setProductCarousel(newCarousel);
    };

    // Handle updating the product
    const handleUpdateProduct = async () => {
        const updatedProduct = {
            title: productName,
            description: productDescription,
            mainImg: productMainImg,
            carousel: productCarousel,
            sizes: productSizes,
            gender: productGender,
            category: productCategory,
            newCategory: productNewCategory,
            price: productPrice,
            discount: productDiscount,
        };

        try {
            const token = sessionStorage.getItem('token'); 
            const response = await axios.put(`http://localhost:3001/api/products/update-product/${id}`, updatedProduct,{
                headers: { Authorization: `Bearer ${token}` },
        });
            console.log(response);
            alert('Product updated successfully');
            navigate('/admin');
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.response && error.response.data.errors) {
                // Handle validation errors from the server
                setErrorMessage(error.response.data.errors.map(err => err.msg).join(', '));
            } else {
                setErrorMessage('Failed to update product');
            }
        }
    };

    return (
        <div className="new-prod-page-bg">
            <div className="new-product-page">
                <div className="new-product-container">
                    <h3>Update Product</h3>
                    <div className="new-product-body">
                        <div className="input-group">
                            <label className="custom-label">Product Name</label>
                            <input
                                type="text"
                                className="custom-input"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Product Name"
                                required
                            />
                        </div>
    
                        <div className="input-group">
                            <label className="custom-label">Product Description</label>
                            <textarea
                                className="custom-input"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                placeholder="Product Description"
                                required
                            />
                        </div>
    
                        <div className="input-group">
                            <label className="custom-label">Main Image URL</label>
                            <input
                                type="text"
                                className="custom-input"
                                value={productMainImg}
                                onChange={(e) => setProductMainImg(e.target.value)}
                                placeholder="Main Image URL"
                                required
                            />
                        </div>
    
                        <label className="custom-label">Carousel Image URLs</label>
                        {productCarousel.map((img, idx) => (
                            <div key={idx} className="input-group">
                                <input
                                    type="text"
                                    className="custom-input"
                                    value={img}
                                    onChange={(e) => handleCarouselChange(e, idx)}
                                    placeholder={`Carousel Image ${idx + 1} URL`}
                                />
                            </div>
                        ))}
    
                        <div className="sizes-gender-container">
                            {/* Available Sizes */}
                            <div className="size-section">
                                <label className="custom-label">Available Sizes</label>
                                {['S', 'M', 'L', 'XL'].map((size) => (
                                    <div key={size} className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            value={size}
                                            checked={productSizes.includes(size)}
                                            onChange={handleCheckBox}
                                        />
                                        <label>{size}</label>
                                    </div>
                                ))}
                            </div>
    
                            {/* Gender Options */}
                            <div className="gender-section">
                                <label className="custom-label">Gender</label>
                                {['Men', 'Women', 'Unisex'].map((gender) => (
                                    <div key={gender} className="radio-group">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={gender}
                                            checked={productGender === gender}
                                            onChange={() => setProductGender(gender)}
                                        />
                                        <label>{gender}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
    
                        <label className="custom-label">Product Category</label>
                        <div className="input-group">
                            <select
                                className="custom-input"
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value)}
                            >
                                <option value="">Choose Product Category</option>
                                {availableCategories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                                <option value="new category">New Category</option>
                            </select>
                        </div>
    
                        {productCategory === 'new category' && (
                            <div className="input-group">
                                <label className="custom-label">New Category</label>
                                <input
                                    type="text"
                                    className="custom-input"
                                    value={productNewCategory}
                                    onChange={(e) => setProductNewCategory(e.target.value)}
                                    placeholder="New Category"
                                />
                            </div>
                        )}
    
                        <div className="input-group">
                            <label className="custom-label">Price</label>
                            <input
                                type="number"
                                className="custom-input"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                                placeholder="Price"
                                min="0"
                                required
                            />
                        </div>
    
                        <div className="input-group">
                            <label className="custom-label">Discount (%)</label>
                            <input
                                type="number"
                                className="custom-input"
                                value={productDiscount}
                                onChange={(e) => setProductDiscount(e.target.value)}
                                placeholder="Discount (%)"
                                min="0"
                            />
                        </div>
                    </div>
    
                    <button className="custom-button" onClick={handleUpdateProduct}>
                        Update Product
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
    
    
};

export default UpdateProduct;
