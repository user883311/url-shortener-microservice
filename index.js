// DEPENDENCIES
//-------------

const startupDebugger = require("debug")("app:startup");
const config = require("config");
const morgan = require("morgan");
const express = require("express"); // returns a function
const app = express();

const dbInit = require("./routes/db");

require("./startup/prod")(app);

const urlsModule = require("./routes/urls");
// const app_add = require("./routes/add");
// const app_retrieve = require("./routes/retrieve");

app.use(express.static("public"));
app.use("/", urlsModule);
// app.use("/new/*", app_add);
// app.use("/", app_retrieve);

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