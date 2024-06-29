import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Cart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialCart = location.state ? location.state.cart : [];
    const [cart, setCart] = useState(initialCart);
    const [total, setTotal] = useState(0);
    const [totalqt, setTotalqt] = useState(0);
    useEffect(() => {
        calculateTotal();
        calculateTotalQuantity();
    }, [cart, total, totalqt]);
    const calculateTotalQuantity = () => {
        setTotalqt(cart.reduce((total, item) => total + item.quantity, 0));
    };
    const handleQuantityChange = (product, delta) => {
        setCart((prevCart) => {
            const updatedCart = prevCart
                .map((p) =>
                    p._id === product._id
                        ? { ...p, quantity: p.quantity + delta }
                        : p
                )
                .filter((p) => p.quantity > 0);
            return updatedCart;
        });
    };

    const calculateTotal = () => {
        const totalAmount = cart.reduce(
            (acc, product) => acc + product.price * product.quantity,
            0
        );
        setTotal(totalAmount);
    };

    const handlePayment = () => {
        navigate("/payment", { state: { cart, total } });
    };

    return (
        <div className="p-4">
            <Link to="/">
                <img
                    src="/assets/img/logo.jpeg"
                    alt="company logo"
                    className="md:h-28 m-auto"
                />
            </Link>
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {/* <div className="bg-green-100 p-2 mb-4">
                You are saving ₹326.95 on this order
            </div> */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    Available offers for you
                </h2>
                <div className="flex justify-between p-2 border mb-2">
                    <div>BUY 2 GET 1 Sample Free</div>
                </div>
                {/* <div className="flex justify-between p-2 border">
                    <div>
                        Save Upto ₹222 on Orders Above ₹899
                        <span className="block text-sm text-gray-500">
                            View details
                        </span>
                    </div>
                    <button className="bg-gray-200 px-2 py-1 rounded">
                        APPLY
                    </button>
                </div> */}
            </div>
            <div>
                {cart.map((product) => (
                    <div
                        key={product._id}
                        className="flex items-center justify-between p-4 border-b"
                    >
                        <div className="flex items-center">
                            <img
                                src={`http://localhost:5000/${product.image}`}
                                alt={product.name}
                                className="w-16 h-16 rounded"
                            />
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold">
                                    {product.name}
                                </h2>
                                <p className="text-green-600">
                                    ₹{product.price}.00
                                </p>
                                {/* <p className="text-red-500">
                                    {product.discount}% OFF
                                </p> */}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() =>
                                    handleQuantityChange(product, -1)
                                }
                                className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                            >
                                -
                            </button>
                            <span className="mx-2">{product.quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(product, 1)}
                                className="bg-green-500 text-white px-2 py-1 rounded"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-0 fixed bottom-0 left-0 w-full">
                <div>
                    <p className="text-center">
                        {" "}
                        {totalqt >= 2
                            ? "Congratulation you are getting a free sample"
                            : `Add ${
                                  2 - totalqt
                              } more quantity to get a free sample`}
                    </p>
                </div>
                <div className="  bg-white p-4 flex justify-between items-center border-t">
                    <div className="text-lg font-semibold">
                        To pay: ₹{total.toFixed(2)}
                    </div>
                    <button
                        onClick={totalqt > 0 ? handlePayment : null}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add address
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
