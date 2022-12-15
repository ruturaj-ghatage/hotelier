const jwt = require("jsonwebtoken");
const validator = require("validator");

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password should be better");
            }
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    avatar: {
        type: Buffer,
    },
});

// Hash the plain text password before saving
HotelSchema.statics.findByCredentials = async (email, password) => {
    const hotel = await Hotel.findOne({ email });

    if (!hotel) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, hotel.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return hotel;
};

// Hash the plain text password before saving
HotelSchema.methods.generateAuthToken = async function () {
    const hotel = this;
    const token = jwt.sign({ _id: hotel._id.toString() }, "asdfghjkl");

    hotel.tokens = hotel.tokens.concat({ token });

    await hotel.save();

    return token;
};

// Execute this function before saving the hotel
HotelSchema.pre("save", async function (next) {
    const hotel = this;

    if (hotel.isModified("password")) {
        hotel.password = await bcrypt.hash(hotel.password, 8);
    }

    next();
});

// Establish the relationship between the hotel and the menu
HotelSchema.virtual("menu", {
    ref: "Menu",
    localField: "_id",
    foreignField: "owner",
});

HotelSchema.virtual("order", {
    ref: "Order",
    localField: "_id",
    foreignField: "owner",
});

// Delete the menu when hotel is deleted
HotelSchema.pre("remove", async function (next) {

    const hotel = this;

    await Menu.deleteMany({ owner: hotel._id });

    next();

});

const Hotel = mongoose.model("Hotel", HotelSchema);

module.exports = Hotel;
