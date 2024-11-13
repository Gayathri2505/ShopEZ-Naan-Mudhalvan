import React from "react";
import CarouselComponent from "../components/Carousel";
import FeaturedCategories from "../components/FeaturedCategories";
import Footer from "../components/Footer";
import Products from "../components/Products";
import "../styles/Home.css";

const Home = () => {
  return (
    <>
      <div className="home-container">
        {/* Carousel Section */}
        <CarouselComponent />
      </div>

      <div className="HomePage">
      <h2 className="featured-categories-heading">Featured Categories</h2>
        <FeaturedCategories/>

        <div id="products-body"></div>
        <Products category="all" />

        <Footer />
      </div>
    </>
  );
};

export default Home;
