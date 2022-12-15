const jwt = require("jsonwebtoken");

const Hotel = require('../models/hotel')

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");

        // console.log(token)

        const decoded = jwt.verify(token, "asdfghjkl");

        const hotel = await Hotel.findOne({
            _id: decoded,
            "tokens.token": token,
        });

        if (!hotel) {
            throw new Error("Hotel Not found");
        }

        req.hotel = hotel;
        req.token = token;

        next();
    } catch (e) {
        console.log(e)
        res.status(400).send({
            error: "Please Authenticate",
        });
    }
};

module.exports = auth;
