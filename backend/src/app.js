const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

// environment variables
dotenv.config();

// start app
const app = express();

// midddlewares

// Detectar si estamos en producción
const isProduction = process.env.NODE_ENV === "production";

// Definir los orígenes permitidos
const allowedOrigins = isProduction
  ? ["https://products-crud-mern-frontend.vercel.app"] // Producción
  : ["http://localhost:3000"]; // Desarrollo

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Solicitud desde origen:", origin || "Sin origen");

      // Permitir si el origen es undefined (Postman/cURL) o está en la lista
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("No permitido por CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Permite cookies y encabezados de autenticación
    optionsSuccessStatus: 200, // Evita errores en navegadores antiguos
  })
);

//middlewares
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
