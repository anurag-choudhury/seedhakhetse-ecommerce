import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductCategory from "./components/ProductCategory";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import OrderSuccess from "./components/OrderSuccess";
import Admin from "./components/Admin";
import Login from "./components/Login";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProductCategory />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/order-success" element={<OrderSuccess />} />
            </Routes>
        </Router>
    );
};

export default App;
