const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    dishes: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            image: {
                type: Buffer,
            },
            category: {
                type: String,
                required: true,
            },
            cuisine_type: {
                type: String,
                required: true,
            },
        },
    ],
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

const Menu = mongoose.model("Menu", MenuSchema);

module.exports = Menu;
