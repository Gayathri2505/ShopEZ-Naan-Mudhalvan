import React from "react";
import '../styles/Customer/OrderList.css';

const OrderList = ({ title, orders, onCancelOrder }) => {
    return (
        <div className={`order-list ${title.toLowerCase()}-orders`}>
            <h4 className="order-list-title">{title} Orders:</h4>
            {orders.length > 0 ? (
                <ul className="order-list-items">
                    {orders.map((order) => (
                        <li key={order._id} className="order-item">
                            <img src={order.mainImg} alt={order.title} className="order-image" />
                            <div className="order-info">
                                <p><strong>Order ID:</strong> {order._id}</p>
                                <div className="order-details">
                                    <p><strong>Product:</strong> {order.title}</p>
                                    <p><strong>Quantity:</strong> {order.quantity}</p>
                                    {order.size && <p><strong>Size:</strong> {order.size}</p>}
                                    <p><strong>Price:</strong> &#8377; {order.price}</p>
                                    <p><strong>Status:</strong> {order.orderStatus}</p>
                                </div>
                            </div>
                            <div className="cancel-button-container">
                                {onCancelOrder && order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && (
                                    <button
                                        className="cancel-button"
                                        onClick={() => onCancelOrder(order._id)}
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No {title.toLowerCase()} orders found.</p>
            )}
        </div>
    );
};

export default OrderList;
