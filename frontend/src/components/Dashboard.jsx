"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/authContext";

export default function Dashboard() {
    const { isLoggedIn } = useAuth();
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

    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            setProducts(response.data);
        } catch (err) {
            setError("Error al cargar los productos.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editProductId) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${editProductId}`, formData);
                setEditProductId(null);
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formData);
            }
            setFormData({ name: "", description: "", price: "", category: "", stock: "" });
            fetchProducts();
        } catch (err) {
            setError("Error al guardar el producto.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
            fetchProducts();
        } catch (err) {
            setError("Error al eliminar el producto.");
        }
    };

    return (
        <>
            <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
                <div className="row w-100 p-4">
                    {/* Lista de productos */}
                    <div className="col-md-7 bg-light p-4 shadow-lg rounded">
                        <h2 className="text-primary text-center mb-4">Lista de Productos</h2>
                        {loading ? <p>Cargando...</p> : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Categoría</th>
                                        <th>Stock</th>
                                        {role === "admin" && <th>Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>${product.price.toFixed(2)}</td>
                                            <td>{product.category}</td>
                                            <td>{product.stock}</td>
                                            {role === "admin" && (
                                                <td>
                                                    <button className="btn btn-warning btn-sm me-2" onClick={() => {
                                                        setEditProductId(product._id);
                                                        setFormData(product);
                                                    }}>Editar</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>Eliminar</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Formulario de administración */}
                    {role === "admin" && (
                        <div className="col-md-5 d-flex align-items-center justify-content-center">
                            <div className="p-4 shadow-lg rounded bg-white w-100" style={{ maxWidth: "400px" }}>
                                <h2 className="text-center text-primary mb-4">{editProductId ? "Editar Producto" : "Agregar Producto"}</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Descripción</label>
                                        <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Precio</label>
                                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Categoría</label>
                                        <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Stock</label>
                                        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="form-control" required />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">{editProductId ? "Guardar Cambios" : "Agregar Producto"}</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
