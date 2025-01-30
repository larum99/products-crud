export const metadata = {
    title: "Dashboard - Gestión de Productos",
};

export default function DashboardLayout({ children }) {
    return (
        <div className="dashboard-container min-h-screen bg-gray-50">
            <div className="p-6">{children}</div>
        </div>
    );
}
