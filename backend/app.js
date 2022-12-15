const express = require("express");
const cors = require("cors");

const con = require("./db");

const app = express();

const hotelRouter = require("./routes/hotel");
const menuRouter = require("./routes/menu");
const orderRouter = require("./routes/order");

app.use(express.json());

app.use(cors());

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.use(hotelRouter);
app.use(menuRouter);
app.use(orderRouter);

app.listen(9000, () => {
    console.log("Server started on port 9000");
    con();
});
