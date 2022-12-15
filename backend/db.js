const mongoose = require("mongoose");

const connectionURL = "mongodb://127.0.0.1:27017/hotelier";

const connecttoMongo = () => {
    mongoose.connect(connectionURL, { useNewUrlParser: true }, ()=>{
        console.log("Connected to mongo successfully")
    });
};

module.exports = connecttoMongo