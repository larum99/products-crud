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

    // Estados para agregar, editar y eliminar productos
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

    // Estado para mostrar el modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    // Función para mostrar el mensaje y desaparecer después de 3 segundos
    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 3000); // El mensaje desaparece después de 3 segundos
    };

    // ABRIR MODAL PARA AGREGAR O EDITAR
    const openModal = (product = null) => {
        setMessage("");

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
            showMessage("❌ No tienes permisos.");
            return;
        }

        try {
            if (isEditing) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${currentProduct._id}`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage("✅ Producto actualizado.");
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showMessage("✅ Producto agregado.");
            }

            setShowModal(false);
            fetchProducts();
        } catch (err) {
            showMessage("❌ Error al procesar la solicitud.");
        }
    };

    // ABRIR MODAL DE ELIMINACION DE PRODUCTO
    const openDeleteModal = (product) => {
        setCurrentProduct(product);
        setShowDeleteModal(true);
    };

    // ELIMINAR PRODUCTO
    const handleDelete = async () => {
        if (!token) {
            showMessage("❌ No tienes permisos.");
            return;
        }

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${currentProduct._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage("✅ Producto eliminado.");
            setShowDeleteModal(false);
            fetchProducts();
        } catch (err) {
            showMessage("❌ Error al eliminar el producto.");
        }
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container py-4">
            <h2 className="text-center text-primary mb-4">Gestión de Productos</h2>

            {/* Mostrar mensajes globalmente */}
            {message && <p className="text-center text-danger mt-3">{message}</p>}

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
                    <button className="btn btn-outline-success" onClick={() => openModal()}>
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
                                            <button className="btn btn-outline-primary btn-sm w-100" onClick={() => openModal(product)}>Editar</button>
                                            <button className="btn btn-outline-danger btn-sm w-100" onClick={() => openDeleteModal(product)}>Eliminar</button>
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
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PARA CONFIRMAR ELIMINACION */}
            {showDeleteModal && currentProduct && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar Producto</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de que deseas eliminar el producto <strong>{currentProduct.name}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
