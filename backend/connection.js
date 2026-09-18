const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

mongoose.connect(url)
    .then(() => {
        console.log("database connected");
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = mongoose;