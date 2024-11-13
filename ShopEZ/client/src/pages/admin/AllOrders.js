import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import "../../styles/Admin/AllOrders.css";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState(["order placed", "In-transit"]);
  const [updateStatus, setUpdateStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [ setError] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/orders/fetch-orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data.reverse());
    } catch (err) {
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await axios.put(
        "http://localhost:3001/api/orders/cancel-order",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order canceled successfully!");
      fetchOrders();
    } catch (err) {
      alert("Order cancellation failed. Please try again.");
    }
  };

  const updateOrderStatus = async (id) => {
    try {
      await axios.put(
        "http://localhost:3001/api/orders/update-order-status",
        { id, updateStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order status updated successfully!");
      setUpdateStatus("");
      fetchOrders();
    } catch (err) {
      alert("Failed to update order status. Please try again.");
    }
  };

  // Filter handler to update filteredStatus based on button click
  const handleFilter = (status) => {
    setFilteredStatus(status);
  };

  return (
    <div className="all-orders-page">
      <h3>Orders</h3>

      {/* Filter buttons */}
      <div className="all-orders-page-content">
        <div className="order-filters">
          <button onClick={() => handleFilter(["order placed"])}>Placed Orders</button>
          <button onClick={() => handleFilter(["In-transit"])}>In-transit Orders</button>
          <button onClick={() => handleFilter(["delivered"])}>Delivered Orders</button>
          <button onClick={() => handleFilter(["cancelled"])}>Cancelled Orders</button>
        </div>

        {/* Display orders based on selected filter */}
        <div className="all-orders">
          {orders
            .filter((order) => filteredStatus.includes(order.orderStatus))
            .map((order) => (
              <div className="all-orders-order" key={order._id}>
                <img src={order.mainImg} alt="" />
                <div className="all-orders-order-data">
                  <h4>{order.title}</h4>
                  <p>{order.description}</p>
                  <div>
                    <span><p><b>Size: </b> {order.size}</p></span>
                    <span><p><b>Quantity: </b> {order.quantity}</p></span>
                    <span><p><b>Price: </b> &#8377;{" "}
                      {parseInt(order.price - (order.price * order.discount) / 100) * order.quantity}</p></span>
                    <span><p><b>Payment method: </b> {order.paymentMethod}</p></span>
                  </div>
                  <div>
                    <span><p><b>UserId: </b> {order.userId}</p></span>
                    <span><p><b>Name: </b> {order.name}</p></span>
                    <span><p><b>Email: </b> {order.email}</p></span>
                    <span><p><b>Mobile: </b> {order.mobile}</p></span>
                  </div>
                  <div>
                    <span><h5><b>Ordered on: </b> {order.orderDate.slice(0, 10)}</h5></span>
                    <span><h5><b>Address: </b> {order.address}</h5></span>
                    <span><h5><b>Pincode: </b> {order.pincode}</h5></span>
                  </div>
                  <div>
                    <span><h5><b>Order status: </b> {order.orderStatus}</h5></span>
                    {order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                      <span>
                        <div>
                          <select
                            className="form-select form-select-sm"
                            defaultValue=""
                            onChange={(e) => setUpdateStatus(e.target.value)}
                          >
                            <option value="" disabled>Update order status</option>
                            {/* Dynamically show options based on current order status */}
                            {order.orderStatus === "order placed" && (
                              <>
                                <option value="In-transit">In-transit</option>
                                <option value="delivered">Delivered</option>
                              </>
                            )}
                            {order.orderStatus === "In-transit" && (
                              <option value="delivered">Delivered</option>
                            )}
                          </select>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() => updateOrderStatus(order._id)}
                        >
                          Update
                        </button>
                      </span>
                    )}
                    {(order.orderStatus === "order placed" || order.orderStatus === "In-transit") && (
                      <button
                        className="btn btn-danger"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllOrders;

