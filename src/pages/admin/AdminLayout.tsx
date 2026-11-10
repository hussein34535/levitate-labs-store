import { useAdmin } from "@/context/AdminContext";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { ShoppingBag, LogOut } from "lucide-react";

const AdminLayout = () => {
  const { isAuthenticated, logout, admin } = useAdmin();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#111118] flex flex-col justify-between p-4">
        <div>
          <div className="mb-8 px-3 py-2">
            <h2 className="font-bold text-lg tracking-wider">ORBITA</h2>
            <span className="text-xs text-gray-500">Admin Panel</span>
          </div>

          <nav className="space-y-1">
            <Link
              to="/admin/orders"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname.startsWith("/admin/orders")
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingBag size={18} />
              Orders
            </Link>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-4 px-3">
          <div className="mb-3">
            <p className="text-sm font-medium text-white">{admin?.name}</p>
            <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors w-full py-1.5"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
