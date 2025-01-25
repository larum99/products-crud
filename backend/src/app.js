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
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de gestión de productos" });
});

// connect to DB
(async () => {
    try {
      await connectDB();
      console.log("Conexión correctamente establecida a la base de datos");
    } catch (error) {
      console.error("Error para conectar a la base de datos:", error.message);
      process.exit(1);
    }
  }
)();

module.exports = app;
