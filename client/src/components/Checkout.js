import React, { useState } from 'react';

const Checkout = ({ name, setName, mobile, setMobile, email, setEmail, address, setAddress, pincode, setPincode, paymentMethod, setPaymentMethod, onBuyNow }) => {
    return (
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="checkoutModalLabel">Checkout</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="checkout-address">
                            <h4>Details</h4>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="nameInput" value={name} onChange={(e) => setName(e.target.value)} />
                                <label htmlFor="nameInput">Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="mobileInput" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                                <label htmlFor="mobileInput">Mobile</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <label htmlFor="emailInput">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="addressInput" value={address} onChange={(e) => setAddress(e.target.value)} />
                                <label htmlFor="addressInput">Address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="pincodeInput" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                                <label htmlFor="pincodeInput">Pincode</label>
                            </div>
                        </div>
                        <div className="checkout-payment-method">
                            <h4>Payment method</h4>
                            <div className="form-floating mb-3">
                                <select className="form-select" id="paymentMethodSelect" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <option value="">Select payment method</option>
                                    <option value="netbanking">Netbanking</option>
                                    <option value="card">Card Payments</option>
                                    <option value="upi">UPI</option>
                                    <option value="cod">Cash on Delivery</option>
                                </select>
                                <label htmlFor="paymentMethodSelect">Choose Payment Method</label>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onBuyNow}>Buy Now</button>
                    </div>
                </div>
            </div>
    );
};

export default Checkout;
