import React from 'react';
import '../styles/Admin/AdminStyles.css';

const AdminCard = ({ title, count, buttonText, onClick }) => {
    return (
        <div className="admin-home-card">
            <h5>{title}</h5>
            <p>{count}</p>
            <button onClick={onClick}>{buttonText}</button>
        </div>
    );
};


export default AdminCard;
