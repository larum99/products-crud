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
    const [errors, setErrors] = useState({});  // Guardamos los errores de forma simple
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        // Validamos que los campos no estén vacíos solo al hacer blur
        if (!email && name === "email") {
            setErrors((prev) => ({
                ...prev,
                email: "El correo electrónico es obligatorio",
            }));
        } else if (!password && name === "password") {
            setErrors((prev) => ({
                ...prev,
                password: "La contraseña es obligatoria",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        let formErrors = {};

        if (!email) formErrors.email = "El correo electrónico es obligatorio";
        if (!password) formErrors.password = "La contraseña es obligatoria";

        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validamos solo antes de hacer la solicitud
        const formErrors = validateForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
                    {
                        email,
                        password,
                    }
                );

                localStorage.setItem("token", response.data.token);
                login(response.data.token); // Actualiza el estado global pasando el token

                // Redirigir según el rol del usuario
                if (response.data.user.role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/");
                }
            } catch (error) {
                setError(error.response?.data?.message || "Ocurrió un error. Por favor, intenta nuevamente.");
            }
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
                    name="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                />
                {errors.password && <p className="text-danger">{errors.password}</p>}
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
