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

            localStorage.setItem("token", response.data.token);
            login(response.data.token);

            if (response.data.user.role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Ocurrió un error. Por favor, intenta nuevamente.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {error && <p className="text-danger mb-3">{error}</p>}
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
            <p className="text-center text-muted mt-3">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-decoration-none text-primary">
                    Regístrate aquí
                </Link>
            </p>
        </form>
    );
}
