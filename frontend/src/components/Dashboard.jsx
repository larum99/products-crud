"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    // Estado del modal y formulario
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: ""
    });
    const [message, setMessage] = useState("");

    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

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
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const token = localStorage.getItem("token"); // Obtener token almacenado

        if (!token) {
            setMessage("❌ No tienes permisos para agregar productos.");
            return;
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/products`,
                newProduct,
                {
                    headers: { Authorization: `Bearer ${token}` } // Agregar token en la petición
                }
            );

            setMessage("✅ Producto agregado con éxito.");
            setNewProduct({ name: "", description: "", price: "", category: "", stock: "" });
            setShowModal(false);
            fetchProducts(); // Recargar lista
        } catch (err) {
            setMessage("❌ Error al agregar el producto.");
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
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>
                        Agregar Producto
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
                                            <button className="btn btn-warning btn-sm w-100">Editar</button>
                                            <button className="btn btn-danger btn-sm w-100">Eliminar</button>
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

            {/* MODAL PARA AGREGAR PRODUCTO */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Agregar Producto</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={newProduct.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Descripción</label>
                                        <input
                                            type="text"
                                            name="description"
                                            className="form-control"
                                            value={newProduct.description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Precio</label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="form-control"
                                            value={newProduct.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Categoría</label>
                                        <input
                                            type="text"
                                            name="category"
                                            className="form-control"
                                            value={newProduct.category}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Inventario</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            className="form-control"
                                            value={newProduct.stock}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Guardar Producto
                                        </button>
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
