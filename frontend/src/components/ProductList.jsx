"use client";

import axios from "axios";

export default function ProductList({ products, role, fetchProducts }) {
    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchProducts();
        } catch (err) {
            alert("Error al eliminar el producto.");
        }
    };

    return (
        <div className="card p-3">
            <h3 className="text-center">Lista de Productos</h3>
            <table className="table table-bordered">
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
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.category}</td>
                                <td>{product.stock}</td>
                                {role === "admin" && (
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2">Editar</button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={role === "admin" ? 6 : 5} className="text-center">
                                No hay productos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
