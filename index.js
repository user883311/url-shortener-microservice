const Joi = require('joi');
const express = require("express"); // returns a function
const app = express();
const getUrls = require("get-urls");

const hostname = "localhost";
const port = process.env.PORT || 3000;

let database = new Object();

app.post("/*", (req, res) => {
    /* Credit on this regex to validate URLs goes to Daveo
    https://stackoverflow.com/a/3809435 */
    const urlReg = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
    console.log(req.params['0']);
    const schema_url = {
        '0': Joi.string().regex(urlReg).required()
    };
    const result = Joi.validate(req.params, schema_url);
    if (result.error) {
        // 400 Bad Request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const l = Object.keys(database).length;
    let m = l + 1;
    m = m.toString();
    database[m] = req.params['0'];
    res.send({
        "id": m,
        "original_url": req.params['0'],
        "short_url": `${hostname}:${port}/${m}`
    });
});

app.get("/", (req, res) => { res.send(database) });

app.get("/:id", (req, res) => {
    if (!database[req.params.id]) {
        // 400 Bad Request
        res.status(400).send("This micro URL is not in our database.");
        return;
    }
    res.send(database[req.params.id]);
});

function returnLongUrl(id1) {
    database.forEach((element) => {
        if (element.id = id1) { return element.longUrl }
    })
    return undefined;
}

// PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}... `);
});