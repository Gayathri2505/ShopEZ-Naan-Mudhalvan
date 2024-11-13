import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Customer/FeaturedCategories.css'; 

const FeaturedCategories = () => {
    const navigate = useNavigate();
    return (
        <div className="home-categories-container">
          <div
            className="home-category-card"
            onClick={() => navigate("/category/Beauty Products")}
          >
            <img
              src="https://d2s30hray1l0uq.cloudfront.net/frontend/brand-motto.jpg"
              alt="Beauty Products"
            />
            <h5>Beauty Products</h5>
          </div>

          <div
            className="home-category-card"
            onClick={() => navigate("/category/Electronics")}
          >
            <img
              src="https://img.etimg.com/photo/msid-98815516,imgsize-24654/LavaZ3.jpg"
              alt="Electronics"
            />
            <h5>Electronics</h5>
          </div>

          <div
            className="home-category-card"
            onClick={() => navigate("/category/Accessories")}
          >
            <img
              src="https://sc04.alicdn.com/kf/HTB1hVJqeoKF3KVjSZFEq6xExFXa3.jpg"
              alt="Accessories"
            />
            <h5>Accessories</h5>
          </div>

          <div
            className="home-category-card"
            onClick={() => navigate("/category/Fashion")}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDHJXo4CY25hLCB1W_o8gC_dxBxTnX1PjoxA&s"
              alt="Fashion"
            />
            <h5>Fashion</h5>
          </div>

          <div
            className="home-category-card"
            onClick={() => navigate("/category/Groceries")}
          >
            <img
              src="https://thumbs.dreamstime.com/b/lots-groceries-17001094.jpg"
              alt="Groceries"
            />
            <h5>Groceries</h5>
          </div>

          <div
            className="home-category-card"
            onClick={() => navigate("/category/Stationaries")}
          >
            <img
              src="https://png.pngtree.com/png-vector/20240309/ourmid/pngtree-back-to-school-with-the-box-and-stationary-png-image_11904188.png"
              alt="Stationaries"
            />
            <h5>Stationaries</h5>
          </div>          
        </div>
    );
};

export default FeaturedCategories;
