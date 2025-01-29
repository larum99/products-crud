"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
    });
    const [editProductId, setEditProductId] = useState(null);
    
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null; // 🔥 Obtener rol

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            setProducts(response.data);
        } catch (err) {
            setError("Error al cargar los productos. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setFormData({ name: "", description: "", price: "", category: "", stock: "" });
            fetchProducts();
        } catch (err) {
            setError("Error al agregar el producto. Asegúrate de tener permisos de administrador.");
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/products/${editProductId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setEditProductId(null);
            setFormData({ name: "", description: "", price: "", category: "", stock: "" });
            fetchProducts();
        } catch (err) {
            setError("Error al editar el producto. Asegúrate de tener permisos de administrador.");
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            fetchProducts();
        } catch (err) {
            setError("Error al eliminar el producto. Asegúrate de tener permisos de administrador.");
        }
    };

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <div className="table-responsive">
            <h2>Administrar Productos</h2>

            {/* 🔥 Mostrar formulario solo si es admin */}
            {role === "admin" && (
                <form onSubmit={editProductId ? handleEditProduct : handleAddProduct} className="mb-4">
                    <div className="form-group">
                        <label>Nombre del producto</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Precio</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Categoría</label>
                        <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Inventario</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">
                        {editProductId ? "Editar Producto" : "Agregar Producto"}
                    </button>
                </form>
            )}

            {/* Tabla de productos */}
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Inventario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.category}</td>
                                <td>{product.stock}</td>
                                <td>
                                    {/* 🔥 Mostrar botones solo si es admin */}
                                    {role === "admin" && (
                                        <>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => {
                                                    setEditProductId(product._id);
                                                    setFormData(product);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteProduct(product._id)}
                                            >
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No hay productos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
