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
    <div className="container-fluid home-container d-flex flex-column justify-content-center align-items-center text-center">
      <h1 className="home-title text-dark">¡Bienvenido a tu App de Gestión de Productos!</h1>
      <button className="btn btn-primary mt-3 home-button" onClick={handleLoginClick}>
        Coméncemos
      </button>
    </div>
  );
}
