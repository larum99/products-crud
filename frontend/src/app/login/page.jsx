import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="container-fluid login-container d-flex justify-content-center align-items-center">
            <div className="login-card w-100 max-w-md p-4 p-md-5">
                <h1 className="text-center login-title mb-4">
                    Iniciar sesión
                </h1>
                <LoginForm />
            </div>
        </div>
    );
}
