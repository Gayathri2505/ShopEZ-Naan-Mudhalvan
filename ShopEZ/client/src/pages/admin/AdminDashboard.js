import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCard from '../../components/AdminCard';
import Footer from '../../components/Footer';
import '../../styles/Admin/AdminStyles.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);

    useEffect(() => {
        fetchCountData();
    }, []);

    const fetchCountData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const userResponse = await axios.get('http://localhost:3001/api/users/fetch-users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Fetched Users:', userResponse.data); // Log user data
            setUserCount(userResponse.data.length);

            const productResponse = await axios.get('http://localhost:3001/api/products/fetch-products');
            setProductCount(productResponse.data.length);

            const orderResponse = await axios.get('http://localhost:3001/api/orders/fetch-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrdersCount(orderResponse.data.length);
        } catch (error) {
            console.error('Error fetching count data:', error);
        }
    };

    return (
      <>
      <div className="admin-page">
          <h3>Admin Dashboard</h3>
          <div className="admin-content">
            <AdminCard
              title="Total Users"
              count={userCount}
              buttonText="View all"
              onClick={() => navigate('/all_users')}
            />
            <AdminCard
              title="All Products"
              count={productCount}
              buttonText="View all"
              onClick={() => navigate('/all_products')}
            />
            <AdminCard
              title="All Orders"
              count={ordersCount}
              buttonText="View all"
              onClick={() => navigate('/all_orders')}
            />
            <AdminCard
              title="Add Product"
              count="(new)"
              buttonText="Add now"
              onClick={() => navigate('/new_product')}
            />
          </div>
          
        </div>
        <Footer />
      </>
        
      );
      
          
};

export default AdminDashboard;
