const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "La descripción del producto es obligatoria"],
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio no puede ser negativo"],
    },
    category: {
        type: String,
        required: [true, "La categoría es obligatoria"],
    },
    stock: {
        type: Number,
        required: [true, "La cantidad en inventario es obligatoria"],
        min: [0, "La cantidad no puede ser negativa"],
    },
}, {
        timestamps: true,
        versionKey: false,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;