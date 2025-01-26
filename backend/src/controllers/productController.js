const Product = require("../models/Product");

// get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};

// create product (only admin)
const createProduct = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado, solo el administrador puede crear productos" });
    }

    try {
        const { name, description, price, category, stock } = req.body;
        const newProduct = new Product({ name, description, price, category, stock });
        await newProduct.save();
        res.status(201).json({ message: "Producto creado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear producto", error: error.message });
    }
};

// update product (only admin)
const updateProduct = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado, solo el admin puede actualizar productos" });
    }
    
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.status(200).json({ message: "Producto actualizado correctamente", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar producto", error: error.message });
    }
};

// delete product (only admin)
const deleteProduct = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado, solo el administrador puede eliminar productos"})
    }

    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error: error.message });
    }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };