"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // Function to handle redirection
  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="container text-center">
      <h1 className="mt-5 text-primary">¡Bienvenido a tu App de Gestión de Productos!</h1>
      <button className="btn btn-success" onClick={handleLoginClick}>
        Inicia Sesión
      </button>
    </div>
  );
}
