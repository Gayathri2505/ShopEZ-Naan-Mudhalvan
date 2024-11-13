import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Customer/Carousel.css';

const CarouselComponent = () => {
    const carouselImages = [
        { url: 'https://t3.ftcdn.net/jpg/07/94/31/84/360_F_794318493_zd15A3T9jwufIZbz13GhXleOZlNCu8Vj.jpg', alt: 'Slide 1', caption: 'Welcome to ShopEZ' },
        { url: 'https://static.vecteezy.com/system/resources/previews/007/153/463/non_2x/shopping-online-on-smartphone-and-new-buy-sale-promotion-pink-backgroud-for-banner-market-ecommerce-women-concept-free-vector.jpg', alt: 'Slide 2', caption: 'Exclusive Deals' },
        { url: 'https://img.freepik.com/free-photo/attractive-asian-woman-showing-smartphone-app-shopping-bags-buying-online-via-application-standi_1258-156869.jpg', alt: 'Slide 3', caption: 'Shop the Latest Trends' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextImage = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, [carouselImages.length]);

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
    };

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(nextImage, 3000);
            return () => clearInterval(interval);
        }
    }, [nextImage, isHovered]);

    return (
        <div 
            className="carousel-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="carousel-images">
                <img
                    src={carouselImages[currentIndex].url}
                    alt={carouselImages[currentIndex].alt}
                    className="carousel-image"
                />
                <div className="carousel-caption">
                    <h3>{carouselImages[currentIndex].caption}</h3>
                </div>
            </div>

            {/* Previous and Next Buttons */}
            <button className="carousel-control prev" onClick={prevImage} aria-label="Previous Slide">
                &#10094;
            </button>
            <button className="carousel-control next" onClick={nextImage} aria-label="Next Slide">
                &#10095;
            </button>

            {/* Dots for Indicators */}
            <div className="carousel-indicators">
                {carouselImages.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default CarouselComponent;
