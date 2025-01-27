'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from '../context/authContext';
import Link from "next/link";

export default function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
                {
                    email,
                    password,
                }
            );

            // Guarda el token y actualiza el estado global
            localStorage.setItem("token", response.data.token);
            login(response.data.token); // Actualiza el estado global pasando el token
            console.log("Token guardado:", response.data.token);

            // Redirigir según el rol del usuario
            if (response.data.user.role === "admin") {
                router.push("/admin/dashboard");  // Página para administrar productos
            } else {
                router.push("/");  // Página de usuario regular
            }
        } catch (error) {
            setError(error.response?.data?.message || "Ocurrió un error. Por favor, intenta nuevamente.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 border border-primary rounded-md shadow-md bg-primary">
            <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-secondary-dark">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-secondary-dark">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full py-2 px-4 bg-secondary-dark hover:bg-secondary text-white  font-bold rounded-md hover:bg-primary-dark transition duration-200"
            >
                Iniciar sesión
            </button>

            {/* Enlace al formulario de registro */}
            <p className="text-center text-sm mt-4 text-secondary-dark">
                ¿No tienes una cuenta?{" "}
                <Link
                    href="/register"
                    className="text-secondary hover:underline"
                >
                    Regístrate aquí
                </Link>
            </p>
        </form>
    );
}
