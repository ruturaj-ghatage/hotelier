const express = require("express");
const Menu = require("../models/menu");

const Order = require("../models/order");


const orderRouter = express.Router();

orderRouter.get("/:hotel/order/:table", async (req, res) => {
    try {
        const menu = await Menu.find({ owner: req.hotel._id });
        res.send(menu);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

orderRouter.post("/:hotel/order/:table", async (req, res) => {
    try {

        const order = new Order({
            ...req.body,
            owner: req.hotel._id,
            table: req.params.table
        });

        await order.save();

        res.status(201).send({ order });


    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = orderRouter;
