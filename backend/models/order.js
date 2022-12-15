const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    dishes: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    table: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Hotel",
    },
});


const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;