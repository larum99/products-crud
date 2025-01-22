const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// environment variables
dotenv.config();

// start app
const app = express();

// midddlewares
app.use(cors());
app.use(express.json());

// routes

// test route
app.get("/", (req, res) => {
    res.send("Management products API working properly")
})

module.exports = app;
