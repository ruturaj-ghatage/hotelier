const express = require("express");
const Hotel = require("../models/hotel");

const auth = require("../middleware/auth");

const hotelRouter = new express.Router();

hotelRouter.post("/hotel/create", async (req, res) => {
    const hotel = new Hotel(req.body);

    console.log(req.body);

    try {
        await hotel.save();

        const token = await hotel.generateAuthToken();

        res.status(201).send({ hotel, token });
    } catch (error) {
        // console.log(error)
        res.status(400).json(error);
    }
});

hotelRouter.post("/hotel/login", async (req, res) => {
    try {
        const hotel = await Hotel.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await hotel.generateAuthToken();

        res.send({ hotel, token });
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

hotelRouter.get("/hotel/me", auth, async (req, res) => {
    res.json(req.hotel);
    console.log(req);
});

hotelRouter.post("/hotel/logout", auth, async (req, res) => {
    try {
        req.hotel.tokens = req.hotel.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.hotel.save();

        res.send({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

hotelRouter.delete("/hotel/me", auth, async (req, res) => {
    try {
        await req.hotel.remove();

        res.status(201).json({ message: "Hotel deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

hotelRouter.patch("/hotel/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);

    const allowedUpdates = ["name", "email", "password", "address"];

    const isValidOp = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOp) {
        return res.status(400).send({
            error: "Invalid Updates",
        });
    }

    try {
        updates.forEach((update) => (req.hotel[update] = req.body[update]));

        await req.hotel.save();

        res.json(req.hotel);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = hotelRouter;
