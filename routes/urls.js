const express = require("express");
const router = express.Router();
const Joi = require('joi'); // Object schema validation
// const opn = require('opn'); // open URIs
const config = require("config"); // configuration JSON management
const dbDebugger = require("debug")("app:db"); // debugger message management

const herokuURI = "https://url-shortener-883311.herokuapp.com";
const hostname = config.get("hostname") || herokuURI;
const port = process.env.PORT || config.get("default_port");

const mongoose = require('mongoose');
MONGOLAB_URI = "mongodb://username:0000@ds113799.mlab.com:13799/playground";
const db_url = MONGOLAB_URI || "mongodb://localhost/playground";
console.log(`db_url = ${db_url}`);

mongoose.connect(db_url, function () {})
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


router.get("/new/(*)", (req, res) => {
    console.log("router.get(/new called...");
    /* URL Validation. 
    -------------------
    Credit on this regex to validate URLs goes to Daveo
    on https://stackoverflow.com/a/3809435 */
    const urlReg = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
    const schema_url = {
        '0': Joi.string().regex(urlReg).required()
    };
    const result = Joi.validate(req.params, schema_url);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    };

    // Add new URL to the database
    countUrls().then((len) => {
            len = len.toString();
            createUrl(len, req.params['0']);
            res.send({
                "original_url": req.params['0'],
                "short_url": `${hostname}:${port}/${len}`
            });
        })
        .catch(err => console.error("Could not countUrls():", err));
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    if (!getSpecificUrl(id)) {
        return res.status(404).send("This micro URL is not in our database.");
    }

    getSpecificUrl(id)
        .then((longUrl) => {
            res.send({
                "original_url": longUrl[0].url,
                "short_url": `${hostname}:${port}/${id}`
            });
            // opn(longUrl[0].url); // open in browser
        })
        .catch(err => console.log(`getSpecificUrl(${id}) error: ${err}`));
});

// SUPPORTING FUNCTIONS
//---------------------
async function countUrls() {
    try {
        const l = await Url.count();
        console.log(l);
        return l
    } catch (err) {
        console.log("countUrls() error:", err);
    }
};

async function getEntireUrlList() {
    try {
        const r = await Url.find();
        return r;
    } catch (err) {
        console.log("getEntireUrlList() error:", err);
    }
};

async function createUrl(index, longUrl) {
    try {
        const url = new Url({
            id: index,
            url: longUrl
        });
        const r = await url.save(); // asynchronous
    } catch (err) {
        console.log("createUrl() error:", err);
    }
};

async function getSpecificUrl(i) {
    try {
        i = i.toString();
        const filter = new Object({
            "id": i
        })
        const r = await Url.find(filter);
        return r;
    } catch (err) {
        console.log("getSpecificUrl() error:", err);
    }
};

module.exports = router;