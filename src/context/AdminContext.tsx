import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem("admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("admin_user");
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (admin) {
        localStorage.setItem("admin_user", JSON.stringify(admin));
      } else {
        localStorage.removeItem("admin_user");
      }
    } catch (e) {
      console.error("Failed to persist admin state:", e);
    }
  }, [admin]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();

      // 1. محاولة تسجيل الدخول عبر Supabase Auth إن كان مفعلاً
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (!authError && authData.user) {
        setAdmin({
          id: authData.user.id,
          email: authData.user.email || normalizedEmail,
          name: authData.user.user_metadata?.name || "ORBITA Admin",
        });
        return true;
      }

      // 2. التحقق عبر دالة RPC في قاعدة البيانات بدون كشف جدول admin_users أو password_hash للواجهة
      const { data: match, error: rpcError } = await supabase.rpc("verify_admin_password", {
        input_email: normalizedEmail,
        input_password: password,
      });

      if (rpcError || !match) {
        return false;
      }

      setAdmin({
        id: typeof match === "object" && match?.id ? match.id : "admin",
        email: normalizedEmail,
        name: typeof match === "object" && match?.name ? match.name : "ORBITA Admin",
      });
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut().catch(() => {});
    setAdmin(null);
    localStorage.removeItem("admin_user");
  };

  return (
    <AdminContext.Provider
      value={{ admin, isAuthenticated: !!admin, login, logout, loading }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
};
