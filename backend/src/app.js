const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Inicializar aplicación
const app = express();

// Detectar entorno
const isProduction = process.env.NODE_ENV === "production";

// Definir los orígenes permitidos según el entorno
const allowedOrigins = [
  isProduction
    ? "https://products-crud-mern-frontend.vercel.app" // Producción
    : "http://localhost:3000" // Desarrollo
];

// Configurar CORS
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Solicitud desde origen:", origin || "Sin origen");
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Manejar preflight requests

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
(async () => {
  try {
    await connectDB();
    console.log("✅ Conexión establecida con la base de datos");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
})();

// Rutas
app.use("/api/users", require("./routes/userRoutes")); //también pueden importarse arriba y luego llamar solo la variable
app.use("/api/products", require("./routes/productRoutes"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de gestión de productos" });
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err.message);
  res.status(500).json({ message: "Error en el servidor" });
});

module.exports = app;
