"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import axios from "axios";

export default function Dashboard() {
    const { isLoggedIn, role } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login"); // Redirige si no hay sesión
        } else {
            fetchProducts();
        }
    }, [isLoggedIn]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            setProducts(response.data);
        } catch (err) {
            setError("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Navbar />
            <div className="container mt-5">
                <h1 className="text-center mb-4">Dashboard de Productos</h1>

                {loading ? (
                    <p>Cargando productos...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <div className="row">
                        {/* Lista de productos (Izquierda) */}
                        <div className="col-md-8">
                            <ProductList products={products} role={role} fetchProducts={fetchProducts} />
                        </div>

                        {/* Formulario (Derecha) - Solo visible para Admin */}
                        {role === "admin" && (
                            <div className="col-md-4">
                                <ProductForm fetchProducts={fetchProducts} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
