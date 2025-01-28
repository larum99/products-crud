'use client';
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
                [name]: `${name === 'name' ? 'El nombre' :
                    name === 'email' ? 'El correo' :
                        name === 'password' ? 'La contraseña' :
                            'La confirmación de contraseña'} es obligatorio`,
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }

        if (name === 'confirmPassword' && formData.password !== formData.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Las contraseñas no coinciden"
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
                setErrors({ general: "Ocurrió un error. Por favor, intenta nuevamente." });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {errors.general && <p className="text-danger mb-3">{errors.general}</p>}
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                />
                {errors.name && <p className="text-danger">{errors.name}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
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
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                />
                {errors.password && <p className="text-danger">{errors.password}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                />
                {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-100">
                Registrarme
            </button>

            <p className="text-center text-muted mt-3">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-decoration-none text-primary">
                    Inicia sesión aquí
                </Link>
            </p>
        </form>
    );
}
