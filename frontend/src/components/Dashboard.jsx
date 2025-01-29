"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    // Estados para agregar y editar productos
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: ""
    });

    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (err) {
            setError("Error al cargar los productos.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredProducts(
            products.filter(product =>
                product.name.toLowerCase().includes(value) ||
                product.category.toLowerCase().includes(value)
            )
        );
    };

    const handleInputChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    // ABRIR MODAL PARA AGREGAR O EDITAR
    const openModal = (product = null) => {
        if (product) {
            setIsEditing(true);
            setCurrentProduct(product);
            setProductData(product);
        } else {
            setIsEditing(false);
            setProductData({ name: "", description: "", price: "", category: "", stock: "" });
        }
        setShowModal(true);
    };

    // AGREGAR O EDITAR PRODUCTO
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!token) {
            setMessage("❌ No tienes permisos.");
            return;
        }

        try {
            if (isEditing) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${currentProduct._id}`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage("✅ Producto actualizado.");
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage("✅ Producto agregado.");
            }

            setShowModal(false);
            fetchProducts();
        } catch (err) {
            setMessage("❌ Error al procesar la solicitud.");
        }
    };

    // ELIMINAR PRODUCTO
    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("✅ Producto eliminado.");
            fetchProducts();
        } catch (err) {
            setMessage("❌ Error al eliminar el producto.");
        }
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container py-4">
            <h2 className="text-center text-primary mb-4">Gestión de Productos</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
                {role === "user" && (
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={handleSearch}
                    />
                )}

                {role === "admin" && (
                    <button className="btn btn-success" onClick={() => openModal()}>
                        ➕ Agregar Producto
                    </button>
                )}
            </div>

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
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.stock}</td>
                                <td>
                                    {role === "admin" ? (
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-warning btn-sm w-100" onClick={() => openModal(product)}>Editar</button>
                                            <button className="btn btn-danger btn-sm w-100" onClick={() => handleDelete(product._id)}>Eliminar</button>
                                        </div>
                                    ) : (
                                        <span className="text-muted">Habilitado solo para admin</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No hay productos disponibles.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* MODAL PARA AGREGAR / EDITAR PRODUCTO */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? "Editar Producto" : "Agregar Producto"}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    {["name", "description", "price", "category", "stock"].map((field) => (
                                        <div className="mb-3" key={field}>
                                            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                            <input
                                                type={field === "price" || field === "stock" ? "number" : "text"}
                                                name={field}
                                                className="form-control"
                                                value={productData[field]}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    ))}

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">{isEditing ? "Actualizar" : "Guardar"}</button>
                                    </div>
                                </form>

                                {message && <p className="mt-3 text-center">{message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
