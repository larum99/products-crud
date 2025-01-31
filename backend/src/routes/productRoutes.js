const express = require("express");
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require("..//controllers/productController");
const { authMiddleware, verifyRole } = require("..//middlewares/authMiddleware");

// get products (public access)
router.get("/", getProducts);

// create products (only admin)
router.post("/", authMiddleware, verifyRole(["admin"]), createProduct);

// update product (only admin)
router.put("/:id", authMiddleware, verifyRole(["admin"]), updateProduct);

// delete product (only admin)
router.delete("/:id", authMiddleware, verifyRole(["admin"]), deleteProduct);

module.exports = router;