const express = require("express");
const router = express.Router();
const opn = require('opn'); // open URIs
// const dbInit = require("./routes/db");

// RETRIEVE OPERATION
// ------------------
router.get("/:id", (req, res) => {
    const id = req.params.id;
    if (!getSpecificUrl(id)) {
        return res.status(404).send("This micro URL is not in our database.");
    }

    getSpecificUrl(id).then((longUrl) => {
        res.send({
            "original_url": longUrl[0].url,
            "short_url": `${hostname}:${port}/${id}`
        });
        opn(longUrl[0].url); // open in browser
    });
});

// SUPPORTING FUNCTIONS
//---------------------

async function getSpecificUrl(i) {
    i = i.toString();
    const filter = new Object({
        "id": i
    })
    const r = await Url.find(filter);
    return r;
};

module.exports = router;