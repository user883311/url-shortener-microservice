module.exports = exports = () => {
    console.log("database working");
    const mongoose = require('mongoose');
    mongoose.connect("mongodb://localhost/playground", function () {})
        .then(() => {
            console.log("Connected to MongoDB")
        })
        .catch(err => console.error("Could not connect to MongoDB", err));

    // DATABASE MODEL
    //---------------
    const urlSchema = new mongoose.Schema({
        id: Number,
        url: String
    });
    const Url = mongoose.model("url", urlSchema); // class
    dbDebugger("Connected to the database...");

};