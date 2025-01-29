export const metadata = {
    title: "Iniciar Sesión - Gestión de Productos",
};

export default function LoginLayout({ children }) {
    return (
        <div className="auth-container flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                {children}
            </div>
        </div>
    );
}
