import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="container-fluid vh-100 d-flex">
            {/* Contenedor de la imagen */}
            <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
                <Image
                    src="/undraw_software-engineer_xv60.svg"
                    alt="Gestión de productos"
                    width={500}
                    height={400}
                    className="img-fluid"
                />
            </div>

            {/* Contenedor del formulario */}
            <div className="col-md-6 d-flex align-items-center justify-content-center">
                <div className="p-4 p-md-5 shadow-lg rounded bg-white w-100" style={{ maxWidth: "400px" }}>
                    <h1 className="text-center text-primary mb-4">Iniciar sesión</h1>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
