const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    paymentId: String,
    orderId: String,
    signature: String,
    cart: Array,
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
