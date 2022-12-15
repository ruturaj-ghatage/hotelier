const express = require("express");
const mongoose = require("mongoose");
const Menu = require("../models/menu");

const auth = require("../middleware/auth");

const menuRouter = new express.Router();

menuRouter.post("/menu/create", auth, async (req, res) => {
    const menu = new Menu({
        ...req.body,
        owner: req.hotel._id,
    });

    // console.log(req.body);

    try {
        await menu.save();

        res.status(201).send({ menu });
    } catch (error) {
        // console.log(error)
        res.status(400).json(error);
    }
});

menuRouter.get("/menu", auth, async (req, res) => {
    try {
        const menu = await Menu.find({ owner: req.hotel._id });
        res.send(menu);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

menuRouter.get("/menu/:id", auth, async (req, res) => {
    const _id = req.params.id;
    console.log(_id);

    try {
        const menu = await Menu.aggregate([
            { $match: { owner: req.hotel._id } },
            { $unwind: "$dishes" },
            { $match: { "dishes._id": mongoose.Types.ObjectId(_id) } },
        ]);

        // const menu = await Menu.find({
        //     owner: req.hotel._id,
        //     dishes: { $elemMatch: { _id: _id } },
        // });

        if (!menu) {
            return res.status(404).send();
        }

        res.send(menu);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

menuRouter.patch("/menu/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "price", "description", "category"];

    const _id = req.params.id;

    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const dish = await Menu.aggregate([
            { $match: { owner: req.hotel._id } },
            { $unwind: "$dishes" },
            { $match: { "dishes._id": mongoose.Types.ObjectId(_id) } },
        ]);

        if (!dish) {
            return res.status(404).send();
        }


        updates.forEach((update) => {
            dish[0].dishes[update] = req.body[update];
        });

        console.log(dish)
        
        await dish.save()

        res.send(dish);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});




module.exports = menuRouter;
