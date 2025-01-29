"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";

export default function Page() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login"); // 🔥 Redirige al login si no está autenticado
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return <p>Redirigiendo...</p>; // Evita parpadeo mientras redirige
    }

    return (
        <main>
            <Navbar />
            <div className="container mt-5">
                
                <Dashboard />
            </div>
        </main>
    );
}
