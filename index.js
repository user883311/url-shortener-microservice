// DEPENDENCIES
//-------------
const startupDebugger = require("debug")("app:startup");
const config = require("config");
const morgan = require("morgan");
const express = require("express"); // returns a function
const app = express();
app.use(express.static("public"));
require("./startup/prod")(app);

const urlsModule = require("./routes/urls");
app.use("/", urlsModule);

// CONFIGURATION
if(app.get("env") === "development"){
    app.use(morgan("tiny"));
    console.log("Morgan enabled");
    console.log(`Application name : ${config.get("name")}`);
};

// ADDRESSES
//----------
const hostname = "localhost";
const port = process.env.PORT || 3000;

// PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}... `)
});