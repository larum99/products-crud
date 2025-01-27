'use client';

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null); // Nuevo estado para el rol del usuario

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const { role } = JSON.parse(atob(token.split(".")[1])); // Decodificar token
                setIsLoggedIn(true);
                setRole(role);
            } catch (error) {
                console.error("Token inválido:", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const login = (token) => {
        const { role } = JSON.parse(atob(token.split(".")[1])); // Decodificar rol
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        setRole(role);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
