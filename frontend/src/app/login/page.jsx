import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-primary mb-6">
                    Iniciar sesión
                </h1>
                <LoginForm />
            </div>
        </div>
    );
}
