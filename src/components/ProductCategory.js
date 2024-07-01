// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// const products = [
//     {
//         id: 1,
//         name: "SidhaKhetSe Kadak Chai | 250 gram | Best Kadak Chai for Desi Chai Lovers!",
//         price: 1,
//         imageUrl: "assets/img/SidhaKhetSe Kadak Chai.jpg",
//     },
//     {
//         id: 2,
//         name: "SidhaKhetSe Taaza Chai | 250 gram | Best Chai for Desi Chai Lovers!",
//         price: 330,
//         imageUrl: "assets/img/SidhaKhetSe Taaza Chai.jpg",
//     },
//     {
//         id: 3,
//         name: "SidhaKhetSe Elaichi Chai | Dastaan-E-Elaichi | 100 gram | Best Elaichi Chai of India",
//         price: 330,
//         imageUrl: "assets/img/SidhaKhetSe Elaichi Chai.jpg",
//     },
//     {
//         id: 4,
//         name: "SidhaKhetSe Masala Chai | 100 gram | Best Masala Chai",
//         price: 330,
//         imageUrl: "assets/img/SidhaKhetSe Masala Chai.jpg",
//     },
//     {
//         id: 5,
//         name: "SidhaKhetSe Rose Chai | Ruhani-Rose | 100 gram | Best Rose Chai In India",
//         price: 330,
//         imageUrl: "assets/img/SidhaKhetSe Rose Chai.jpg",
//     },
//     {
//         id: 6,
//         name: "Dummy prod",
//         price: 1,
//         imageUrl: "assets/img/SidhaKhetSe Rose Chai.jpg",
//     },
//     {
//         id: 7,
//         name: "SidhaKhetSe Chocolate Chai | Chulbuli Chocolate | 100 gram | Best Chocolate Tea In India",
//         price: 330,
//         imageUrl: "assets/img/SidhaKhetSe Chocolate Chai.jpg",
//     },
// ];

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ProductCategory = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [totalqt, setTotalqt] = useState(0);
    const [totalamt, setTotalamt] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    "https://api.sidhakhetse.store/products"
                );
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        // Function to be executed immediately after cart changes
        const updateCart = () => {
            calculateTotal();
            calculateTotalQuantity();
        };

        // Call the update function
        updateCart();
        if (totalqt >= 2) {
            setShowPopup(true);
        }
        if (totalqt < 2) {
            setShowPopup(false);
        }
    }, [cart, totalqt]); // Specify cart as a dependency

    const addToCart = (product) => {
        setCart([...cart, { ...product, quantity: 1 }]);
    };

    const incrementQuantity = (product) => {
        const updatedCart = cart.map((item) =>
            item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        setCart(updatedCart);
    };

    const decrementQuantity = (product) => {
        const updatedCart = cart
            .map((item) =>
                item._id === product._id && item.quantity >= 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0);
        setCart(updatedCart);
    };

    const getQuantity = (product) => {
        const item = cart.find((item) => item._id === product._id);
        return item ? item.quantity : 0;
    };

    const calculateTotal = () => {
        setTotalamt(
            cart.reduce((total, item) => total + item.price * item.quantity, 0)
        );
    };
    const calculateTotalQuantity = () => {
        setTotalqt(cart.reduce((total, item) => total + item.quantity, 0));
    };

    const viewCart = () => {
        navigate("/cart", { state: { cart } });
    };

    return (
        <div className="p-4">
            <Link to="/">
                <img
                    src="/assets/img/logo.jpeg"
                    alt="company logo"
                    className="md:h-28 m-auto"
                    href=""
                />
            </Link>
            <h1 className="text-xl text-center font-bold mb-4 mt-2">
                India's #1 Premium Flavoured Chai
            </h1>
            <img
                src="/assets/img/banner2.jpeg"
                alt="flavoured chai banner"
                className="m-auto md:h-72 rounded-md my-4"
            />
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Category"
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            {showPopup == true && (
                <div className="free-sample-message">
                    <p
                        type="text"
                        value="Congratulations! You are getting a free sample"
                        readOnly
                    >
                        Congratulations! You are getting a free sample"
                    </p>
                </div>
            )}
            <div className="pb-16">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="flex items-center justify-between p-2 border-b"
                    >
                        <div className="flex items-center ">
                            <img
                                src={`https://api.sidhakhetse.store/${product.image}`}
                                alt={product.name}
                                className="w-20 h20 rounded transition-transform duration-300 transform hover:scale-125 "
                            />
                            <div className="ml-4">
                                <h2 className="text-base normal ">
                                    {product.name}
                                </h2>
                                <p className="text-green-600">
                                    ₹{product.price}.00
                                </p>
                            </div>
                        </div>
                        <div>
                            {getQuantity(product) > 0 ? (
                                <div className="flex items-center">
                                    <button
                                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                        onClick={() =>
                                            decrementQuantity(product)
                                        }
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">
                                        {getQuantity(product)}
                                    </span>
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        onClick={() =>
                                            incrementQuantity(product)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-xs min-w-[90px]"
                                    onClick={() => addToCart(product)}
                                >
                                    ADD CART
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="fixed bottom-0 left-0 w-full bg-[#19382B] text-white p-4 flex justify-between items-center"
                onClick={totalqt > 0 ? viewCart : null}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 35 35"
                    id="cart"
                    fill="white"
                    height={40}
                >
                    <path d="M27.47,23.93H14.92A5.09,5.09,0,0,1,10,20L8,11.87a5.11,5.11,0,0,1,5-6.32h16.5a5.11,5.11,0,0,1,5,6.32l-2,8.15A5.1,5.1,0,0,1,27.47,23.93ZM12.94,8.05a2.62,2.62,0,0,0-2.54,3.23l2,8.15a2.6,2.6,0,0,0,2.54,2H27.47a2.6,2.6,0,0,0,2.54-2l2-8.15a2.61,2.61,0,0,0-2.54-3.23Z"></path>
                    <path d="M9.46 14a1.25 1.25 0 0 1-1.21-1L6.46 5.23A3.21 3.21 0 0 0 3.32 2.75H1.69a1.25 1.25 0 0 1 0-2.5H3.32A5.71 5.71 0 0 1 8.9 4.66l1.78 7.77a1.24 1.24 0 0 1-.93 1.5A1.43 1.43 0 0 1 9.46 14zM15.11 34.75a4 4 0 1 1 4-4A4 4 0 0 1 15.11 34.75zm0-5.54a1.52 1.52 0 1 0 1.52 1.52A1.52 1.52 0 0 0 15.11 29.21zM28.93 34.75a4 4 0 1 1 4-4A4 4 0 0 1 28.93 34.75zm0-5.54a1.52 1.52 0 1 0 1.53 1.52A1.52 1.52 0 0 0 28.93 29.21z"></path>
                    <path d="M28.93,29.21H12.27a3.89,3.89,0,1,1,0-7.78h2.65a1.25,1.25,0,1,1,0,2.5H12.27a1.39,1.39,0,1,0,0,2.78H28.93a1.25,1.25,0,0,1,0,2.5Z"></path>
                </svg>
                <div
                    style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "36px",
                        fontWeight: 600,
                        lineHeight: "43.57px",
                        textAlign: "left",
                    }}
                >
                    VIEW CART
                </div>
                <div className="flex items-center">
                    <div className="bg-white text-green-500 px-4 py-2 rounded-full mr-4">
                        ₹{totalamt}
                    </div>
                    <div className="bg-white text-green-500 px-4 py-2 rounded-full">
                        {totalqt}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCategory;
