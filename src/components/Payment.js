import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cart = location.state.cart;
    const total = location.state.total;
    const [errors, setErrors] = useState({});
    const [address, setAddress] = useState({
        name: "",
        email: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        zip: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("");
    const [finalAmount, setFinalAmount] = useState(total);
    console.log(errors);
    useEffect(() => {
        validateForm(); // Validate form on component mount or address change
        for (const key in address) {
            validate(key, address[key]);
        }
    }, [address]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));

        validate(name, value);
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        if (method === "cod") {
            setFinalAmount(total + 20);
        } else {
            setFinalAmount(total);
        }
    };

    const dummyForCod = {
        paymentId: null,
        orderId: `cod-${Date.now()}`,
        signature: null,
    };

    const handlePayment = async () => {
        if (!validateForm()) {
            return;
        }
        if (paymentMethod === "cod") {
            alert("Order placed successfully with Cash on Delivery!");
            saveOrderDetails(dummyForCod, cart, address);
        } else if (paymentMethod === "razorpay") {
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
                    name: "Sidha Khet Se",
                    description: "Product purchase",
                    order_id: orderData.id,
                    handler: function (response) {
                        alert("Payment Successful");
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
        } else {
            alert("Please select a payment method.");
        }
    };

    const createOrder = async (amount) => {
        const response = await fetch(
            "https://api.sidhakhetse.store/create-order",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: amount * 100,
                    currency: "INR",
                }),
            }
        );
        return response.json();
    };

    const saveOrderDetails = async (response, cart, address) => {
        const orderDetails = {
            paymentId: response.razorpay_payment_id || response.paymentId,
            orderId: response.razorpay_order_id || response.orderId,
            signature: response.razorpay_signature || response.signature,
            cart,
            address,
            total: finalAmount,
        };

        const saveResponse = await fetch(
            "https://api.sidhakhetse.store/save-order",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderDetails),
            }
        );

        if (saveResponse.ok) {
            navigate("/order-success", { state: { orderDetails } });
        } else {
            alert("Failed to save order details");
        }
    };

    const validate = (name, value) => {
        let error = "";

        switch (name) {
            case "name":
                if (!value) {
                    error = "Name is required";
                }
                break;
            case "email":
                if (!value) {
                    error = "Email is required";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = "Email is invalid";
                }
                break;
            case "phone":
                if (!value) {
                    error = "Phone number is required";
                } else if (!/^\d{10}$/.test(value)) {
                    error = "Phone number is invalid";
                }
                break;
            case "addressLine":
                if (!value) {
                    error = "Address is required";
                }
                break;
            case "city":
                if (!value) {
                    error = "City is required";
                }
                break;
            case "state":
                if (!value) {
                    error = "State is required";
                }
                break;
            case "zip":
                if (!value) {
                    error = "Zip code is required";
                } else if (!/^\d{6}$/.test(value)) {
                    error = "Zip code is invalid";
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        for (const key in address) {
            if (address[key] === "") {
                newErrors[key] = `${
                    key.charAt(0).toUpperCase() + key.slice(1)
                } is required`;
                isValid = false;
            } else {
                validate(key, address[key]);
                for (let key in errors) {
                    if (errors[key] !== "") {
                        isValid = false;
                        break;
                    }
                }
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            ...newErrors,
        }));
        return (
            isValid && Object.values(newErrors).every((error) => error === "")
        );
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
                    {errors.name && (
                        <p className="text-red-500">{errors.name}</p>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={address.email}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    {errors.email && (
                        <p className="text-red-500">{errors.email}</p>
                    )}

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={address.phone}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    {errors.phone && (
                        <p className="text-red-500">{errors.phone}</p>
                    )}

                    <input
                        type="text"
                        name="addressLine"
                        placeholder="Address"
                        value={address.addressLine}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    {errors.addressLine && (
                        <p className="text-red-500">{errors.addressLine}</p>
                    )}

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    {errors.city && (
                        <p className="text-red-500">{errors.city}</p>
                    )}

                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={address.state}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    {errors.state && (
                        <p className="text-red-500">{errors.state}</p>
                    )}

                    <input
                        type="text"
                        name="zip"
                        placeholder="PIN Code"
                        value={address.zip}
                        onChange={handleChange}
                        className="p-2 border"
                    />
                    {errors.zip && <p className="text-red-500">{errors.zip}</p>}
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
                                src={`https://api.sidhakhetse.store/${product.image}`}
                                alt={product.name}
                                className="w-16 h-16 rounded"
                            />
                            <div className="ml-4">
                                <h3 className="font-bold">{product.name}</h3>
                                <p>Price: ₹{product.price}</p>
                            </div>
                        </div>
                        <div>
                            <p>Quantity: {product.quantity}</p>
                            <p>Subtotal: ₹{product.price * product.quantity}</p>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end p-4">
                    <h2 className="text-xl font-bold">
                        Total Amount: ₹{total}
                    </h2>
                </div>
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Select Payment Method</h2>
                <div>
                    <label className="flex items-center mb-2">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="razorpay"
                            checked={paymentMethod === "razorpay"}
                            onChange={() =>
                                handlePaymentMethodChange("razorpay")
                            }
                            className="mr-2"
                        />
                        Pay Now
                    </label>
                    {cart.reduce((total, item) => total + item.quantity, 0) >
                    1 ? (
                        <label className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === "cod"}
                                onChange={() =>
                                    handlePaymentMethodChange("cod")
                                }
                                className="mr-2"
                            />
                            Cash on Delivery (Additional ₹20)
                        </label>
                    ) : null}
                </div>
            </div>
            <button
                onClick={handlePayment}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Continue
            </button>
        </div>
    );
};

export default Payment;
