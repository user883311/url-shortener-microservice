// DEPENDENCIES
//-------------
const express = require("express"); // returns a function
const app = express();
const Joi = require('joi');
const opn = require('opn');

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/playground")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// DATABASE MODEL
//---------------
const urlSchema = new mongoose.Schema({
    id: Number,
    url: String
});
const Url = mongoose.model("url", urlSchema); // class

// ADDRESSES
//----------
const hostname = "localhost";
const port = process.env.PORT || 3000;

// SUPPORTING FUNCTIONS
//---------------------
async function countUrls() {
    const l = await Url.count();
    console.log(l);
    return l;
};

async function getEntireUrlList() {
    const r = await Url.find();
    return r;
};

async function createUrl(index, longUrl) {
    const url = new Url({
        id: index,
        url: longUrl
    });
    const r = await url.save(); // asynchronous
}

async function getSpecificUrl(i) {
    i = i.toString();
    const filter = new Object({
        "id": i
    })
    const r = await Url.find(filter);
    return r;
};

// CRUD OPERATIONS
//----------------

app.post("/*", (req, res) => {
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
    }

    // Add new URL to the database
    countUrls().then((len) => {
        len = len.toString();
        createUrl(len, req.params['0']);
        res.send({
            "original_url": req.params['0'],
            "short_url": `${hostname}:${port}/${len}`
        });
    });
});

app.get("/", (req, res) => {
    getEntireUrlList().then((temp) => {
        res.send(temp);
    })
});

app.get("/:id", (req, res) => {
    const id = req.params.id;
    if (!getSpecificUrl(id)) {
        return res.status(404).send("This micro URL is not in our database.");
    }

    getSpecificUrl(id).then((longUrl) => {
        res.send({
            "original_url": longUrl[0].url,
            "short_url": `${hostname}:${port}/${id}`
        });
        opn(longUrl[0].url);
    });
});

// PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}... `)
});