'use client'
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        if (!formData[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} es obligatorio`,
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

        if (!formData.name) formErrors.name = "El nombre es obligatorio";
        if (!formData.email) formErrors.email = "El correo es obligatorio";
        if (!formData.password) formErrors.password = "La contraseña es obligatoria";
        if (formData.password !== formData.confirmPassword)
            formErrors.confirmPassword = "Las contraseñas no coinciden";

        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                });

                if (response.data.success) {
                    // Redirigir o mostrar mensaje de éxito
                }
            } catch (err) {
                console.error(err);
                // Manejar errores del servidor
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-secondary-dark">Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
                    required
                />
                {errors.name && <span className="text-red-500">{errors.name}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-secondary-dark">Correo electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
                    required
                />
                {errors.email && <span className="text-red-500">{errors.email}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-secondary-dark">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
                    required
                />
                {errors.password && <span className="text-red-500">{errors.password}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-dark">Confirmar contraseña</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
                    required
                />
                {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Registrarme
            </button>

            <div className="mt-4 text-center">
                <span className="text-secondary-dark">¿Ya tienes cuenta?</span> <Link href="/login" className="text-primary">Iniciar sesión</Link>
            </div>
        </form>
    );
}
