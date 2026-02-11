import { useAdmin } from "@/context/AdminContext";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Package, LogOut, LayoutDashboard } from "lucide-react";

const AdminLayout = () => {
    const { isAuthenticated, admin, logout } = useAdmin();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const navItems = [
        { path: "/admin/orders", label: "Orders", icon: Package },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111118] border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-40">
                {/* Logo */}
                <div className="p-6 border-b border-white/5">
                    <Link to="/admin/orders" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <LayoutDashboard size={16} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold tracking-wider text-sm">ORBITA</h1>
                            <p className="text-[10px] text-gray-500 tracking-wider uppercase">Admin</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {admin?.name?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{admin?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
