import React from "react";
import { useLocation } from "react-router-dom";

const OrderSuccess = () => {
    const location = useLocation();
    const { paymentId, orderId, signature, total } =
        location.state.orderDetails || {};

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Order Successful</h1>
            <p className="mb-2">
                Thank you for your purchase! Your order has been placed
                successfully.
            </p>
            <div className="bg-green-100 p-4 rounded shadow ">
                <h2 className="text-lg font-semibold mb-2">Order Details:</h2>
                <p>
                    <strong>Payment ID:</strong> {paymentId}
                </p>
                <p>
                    <strong>Order ID:</strong> {orderId}
                </p>
                <p className="break-words max-w-full">
                    <strong>Signature:</strong> {signature}
                </p>
                <p>
                    <strong>Total Amount:</strong> {total}
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;
