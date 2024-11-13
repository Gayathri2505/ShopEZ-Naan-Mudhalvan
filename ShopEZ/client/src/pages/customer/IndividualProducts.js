import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import Checkout from '../../components/Checkout';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Customer/IndividualProduct.css';

const IndividualProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateCartCount } = useAuth();
    const uId = sessionStorage.getItem('userId');

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productMainImg, setProductMainImg] = useState('');
    const [productCarouselImg1, setProductCarouselImg1] = useState('');
    const [productCarouselImg2, setProductCarouselImg2] = useState('');
    const [productCarouselImg3, setProductCarouselImg3] = useState('');
    const [productSizes, setProductSizes] = useState([]);
    const [productPrice, setProductPrice] = useState(0);
    const [productDiscount, setProductDiscount] = useState(0);
    const [productQuantity, setProductQuantity] = useState(1);
    const [size, setSize] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    //const [size, setSize] = useState('');
    //const [zoomedImg, setZoomedImg] = useState('');
    const [zoomStyle, setZoomStyle] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/products/fetch-product-details/${id}`);
                const data = response.data;
                setProductName(data.title);
                setProductDescription(data.description);
                setProductMainImg(data.mainImg);
                setProductCarouselImg1(data.carousel[0]);
                setProductCarouselImg2(data.carousel[1]);
                setProductCarouselImg3(data.carousel[2]);
                setProductSizes(data.sizes);
                setProductPrice(data.price);
                setProductDiscount(data.discount);
            } catch (error) {
                console.error("Failed to fetch product details:", error);
            }
        };

        fetchProduct();
    }, [id]); // Only re-run if the `id` changes

    const handleMouseMove = (e, imgSrc) => {
        const image = e.target;
        const { top, left, width, height } = image.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const zoomX = (x / width) * 120;
        const zoomY = (y / height) * 120;

        setZoomStyle({
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: `${width * 2}px ${height * 2}px`,
            backgroundPosition: `${zoomX}% ${zoomY}%`,
            width: '500px',
            height: '500px',
            borderRadius: '10px',
            position: 'absolute',
            top: '50px',
            left: '50%',
            display: 'block',
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ display: 'none' });
    };

    const buyNow = async () => {
        const token = sessionStorage.getItem('token');
        try {
            await axios.post(
                'http://localhost:3001/api/orders/buy-product',
                {
                    userId: uId,
                    name,
                    email,
                    mobile,
                    address,
                    pincode,
                    title: productName,
                    description: productDescription,
                    mainImg: productMainImg,
                    size,
                    quantity: productQuantity,
                    price: productPrice,
                    discount: productDiscount,
                    paymentMethod,
                    orderDate: new Date(),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Order placed!!');
            navigate('/profile');
        } catch (error) {
            alert("Order failed!!");
            console.error("Failed to place order:", error);
        }
    };

    const handleAddToCart = async () => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(
                'http://localhost:3001/api/cart/add-to-cart',
                {
                    userId: uId,
                    title: productName,
                    description: productDescription,
                    mainImg: productMainImg,
                    size,
                    quantity: productQuantity,
                    price: productPrice,
                    discount: productDiscount,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Product added to cart!!");
            updateCartCount();
            navigate('/cart');
        } catch (error) {
            alert("Operation failed!!");
            console.error("Failed to add to cart:", error);
        }
    };

    const isSizeRequired = productSizes.length > 0; // Determine if the product requires a size

    return (
        <>
                <div className="IndividualProduct-page">
            <span onClick={() => navigate('/')} aria-label="Back">
                <HiOutlineArrowSmLeft /> <p>Back</p>
            </span>

            <div className="IndividualProduct-body">
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={productCarouselImg1} className="d-block w-100" alt="Product" onMouseMove={(e) => handleMouseMove(e, productCarouselImg1)}
                                onMouseLeave={handleMouseLeave} />
                        </div>
                        <div className="carousel-item">
                            <img src={productCarouselImg2} className="d-block w-100" alt="Product" onMouseMove={(e) => handleMouseMove(e, productCarouselImg2)}
                                onMouseLeave={handleMouseLeave} />
                        </div>
                        <div className="carousel-item">
                            <img src={productCarouselImg3} className="d-block w-100" alt="Product" onMouseMove={(e) => handleMouseMove(e, productCarouselImg3)}
                                onMouseLeave={handleMouseLeave} />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>



                <div className="zoomedImage" style={zoomStyle}></div>

                

                <div className="IndividualProduct-data">
                    <h3 className="IndividualProduct-title">{productName}</h3>
                    <p>{productDescription}</p>


                    {productSizes.length > 0 && (
                        <div className="size-selection">
                            <h4 className="size-selection-title">Select Size</h4>
                            <div className="size-buttons">
                                {productSizes.map((sizeOption) => (
                                    <button
                                        key={sizeOption}
                                        onClick={() => setSize(sizeOption)}
                                        className={`size-button ${size === sizeOption ? 'selected' : ''}`}
                                    >
                                        {sizeOption}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}



                    <span>
                        <label htmlFor="productQuantity">Quantity</label>
                        <input
                            type="number"
                            id="productQuantity"
                            name="productQuantity"
                            value={productQuantity}
                            min="1"
                            onChange={(e) => setProductQuantity(Number(e.target.value))}
                        />
                    </span>

                    <div className='indvi-price-disp'>
                        <span className="discount">
                            -{productDiscount}%  
                        </span>
                        <span className="discount-price">
                            &#8377; {parseInt(productPrice - (productPrice * productDiscount) / 100)}
                        </span>
                        <span className="mrp-price">
                            MRP: <s>&#8377; {productPrice}</s>
                        </span>
                    </div>

                    <h6>Rating: 4.2/5</h6>
                    <p className="delivery-date">Free delivery in 5 days</p>

                    <div className="productBuyingButtons">
                    <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Buy now</button>
                    <button
                        onClick={handleAddToCart}
                        disabled={isSizeRequired && !size} // Only disable if size is required and not selected
                    >
                        Add to cart
                    </button>
                </div>
                </div>
            </div>

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <Checkout
                    name={name} setName={setName}
                    mobile={mobile} setMobile={setMobile}
                    email={email} setEmail={setEmail}
                    address={address} setAddress={setAddress}
                    pincode={pincode} setPincode={setPincode}
                    paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                    onBuyNow={buyNow}
                />
            </div>
        </div>
        <Footer/>
        </>

    );
};

export default IndividualProduct;
