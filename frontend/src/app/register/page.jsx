import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="max-w-lg mx-auto mt-8">
            <h1 className="text-2xl font-bold text-center text-primary">Crear cuenta</h1>
            <RegisterForm />
        </div>
    );
}
