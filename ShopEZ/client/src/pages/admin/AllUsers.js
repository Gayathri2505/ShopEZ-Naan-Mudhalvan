import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Footer from '../../components/Footer';
import '../../styles/Admin/AllUsers.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token'); 
        const response = await axios.get('http://localhost:3001/api/users/fetch-users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        
        const orderResponse = await axios.get('http://localhost:3001/api/orders/fetch-orders', {
          headers: { Authorization: `Bearer ${token}`},
        });
        setOrders(orderResponse.data);

      } catch (error) {
        setError('Failed to fetch users');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="all-users-page">
      <div className="all-users-container">
      <h3>All Users</h3>

<div className="user-cards">
  {users.map((user) => (
    <div className="user-card" key={user._id}>
      <FaUserCircle className="user-icon" />
      <div className="user-details">
        <p>User ID: {user._id}</p>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Orders: {orders.filter((order) => order.userId === user._id).length}</p>
      </div>
    </div>
  ))}
</div>
      </div>
      

      <Footer/>
    </div>
  );
};

export default AllUsers;