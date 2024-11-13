import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import '../../styles/Admin/NewAndUpdateProduct.css';

const NewProduct = () => {
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/products/fetch-categories');
            setAvailableCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

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

    const handleCreateProduct = async () => {
        const newProduct = {
            title: productName,
            description: productDescription,
            mainImg: productMainImg,
            carousel: productCarousel,
            sizes: productSizes,
            gender: productGender,
            category: productCategory === 'new category' ? productNewCategory : productCategory,
            price: productPrice,
            discount: productDiscount,
        };

        const token = sessionStorage.getItem('token');

        try {
            await axios.post('http://localhost:3001/api/products', newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Product created successfully');
            navigate('/admin');
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <div className='new-prod-page-bg'>


            <div className="new-product-page">
                <div className="new-product-container">
                    <h3>Add New Product</h3>
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
                                <label className="custom-label">Category</label>
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

                    <button className="custom-button" onClick={handleCreateProduct}>
                        Add Product
                    </button>
                </div>
            </div>
          <Footer/>
        </div>
    );
};

export default NewProduct;