import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
            {/* Contenedor del formulario */}
            <div className="col-md-6 d-flex align-items-center justify-content-center">
                <div className="p-4 p-md-5 shadow-lg rounded bg-white w-100" style={{ maxWidth: "400px" }}>
                    <h1 className="text-center text-primary mb-4">Crear cuenta</h1>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
