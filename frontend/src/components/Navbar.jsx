"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        router.push("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand text-primary" href="/dashboard">
                    Gestión de Productos
                </a>
                {isAuthenticated && (
                    <button className="btn btn-outline-dark" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                )}
            </div>
        </nav>
    );
}
