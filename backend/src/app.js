const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

// environment variables
dotenv.config();

// start app
const app = express();

// midddlewares
app.use(cors());
app.use(express.json());

// routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Products Management API" });
});

// connect to DB
(async () => {
    try {
      await connectDB();
      console.log("DB connection established correctly");
    } catch (error) {
      console.error("Error to connect to DB:", error.message);
      process.exit(1);
    }
  }
)();

module.exports = app;
