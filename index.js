// DEPENDENCIES
//-------------
const startupDebugger = require("debug")("app:startup");
const config = require("config");
const morgan = require("morgan");
const express = require("express"); // returns a function
app.use(express.static("public"));
const app = express();
require("./startup/prod")(app);

const urlsModule = require("./routes/urls");
app.use("/", urlsModule);

// CONFIGURATION
if(app.get("env") === "development"){
    app.use(morgan("tiny"));
    startupDebugger("Morgan enabled");
    startupDebugger(`Application name : ${config.get("name")}`);
};

// ADDRESSES
//----------
const hostname = "localhost";
const port = process.env.PORT || 3000;

// PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}... `)
});