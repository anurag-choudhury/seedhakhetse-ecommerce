import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cart = location.state.cart;
    const total = location.state.total;
    const [address, setAddress] = useState({
        name: "",
        email: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        zip: "",
    });

    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        });
    };

    const handlePayment = async () => {
        if (typeof window.Razorpay === "undefined") {
            alert("Razorpay SDK not loaded. Please try again later.");
            return;
        }
        try {
            const orderData = await createOrder(total);

            const options = {
                key: "rzp_live_xalPljigHfSf1p",
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Your Company Name",
                description: "Test Transaction",
                order_id: orderData.id,
                handler: function (response) {
                    alert("Payment Successful");
                    console.log(response);
                    saveOrderDetails(response, cart, address);
                },
                prefill: {
                    name: address.name,
                    email: address.email,
                    contact: address.phone,
                },
                notes: {
                    address: address.addressLine,
                    city: address.city,
                    state: address.state,
                    zip: address.zip,
                },
                theme: {
                    color: "#F37254",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Error in payment:", error);
            alert("Something went wrong!");
        }
    };

    const createOrder = async (amount) => {
        const response = await fetch("http://localhost:5000/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: amount * 100, // Amount in paise
                currency: "INR",
                // receipt: "receipt#1",
            }),
        });
        return response.json();
    };

    const saveOrderDetails = async (response, cart, address) => {
        const orderDetails = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            cart,
            address,
            total,
        };

        const saveResponse = await fetch("http://localhost:5000/save-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderDetails),
        });

        if (saveResponse.ok) {
            navigate("/order-success", { state: { orderDetails } });
        } else {
            alert("Failed to save order details");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Payment</h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={address.name}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={address.email}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={address.phone}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    <input
                        type="text"
                        name="addressLine"
                        placeholder="Address"
                        value={address.addressLine}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={address.state}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    <input
                        type="text"
                        name="zip"
                        placeholder="Zip Code"
                        value={address.zip}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                </div>
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Your Order</h2>
                {cart.map((product) => (
                    <div
                        key={product._id}
                        className="flex items-center justify-between p-4 border-b"
                    >
                        <div className="flex items-center">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-16 h-16 rounded"
                            />
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold">
                                    {product.name}
                                </h2>
                                <p className="text-green-600">
                                    ₹{product.price}.00 x {product.quantity}
                                </p>
                            </div>
                        </div>
                        <div className="text-lg font-semibold">
                            ₹{(product.price * product.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-lg font-semibold mb-4">
                Total: ₹{total.toFixed(2)}
            </div>
            <button
                onClick={handlePayment}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Pay Now
            </button>
        </div>
    );
};

export default Payment;
