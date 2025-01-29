"use client";

import { useState } from "react";
import axios from "axios";

export default function ProductForm({ fetchProducts }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setFormData({ name: "", description: "", price: "", category: "", stock: "" });
            fetchProducts();
        } catch (err) {
            alert("Error al agregar producto.");
        }
    };

    return (
        <div className="card p-3">
            <h3 className="text-center">Agregar Producto</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <input type="text" name="description" className="form-control" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Agregar Producto</button>
            </form>
        </div>
    );
}
