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
        const saved = localStorage.getItem("admin_user");
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (admin) {
            localStorage.setItem("admin_user", JSON.stringify(admin));
        } else {
            localStorage.removeItem("admin_user");
        }
    }, [admin]);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        try {
            // Query admin_users with pgcrypto password check
            const { data, error } = await supabase
                .from("admin_users")
                .select("id, email, name, password_hash")
                .eq("email", email)
                .single();

            if (error || !data) {
                return false;
            }

            // Verify password using Supabase RPC
            const { data: match, error: rpcError } = await supabase
                .rpc("verify_admin_password", { input_email: email, input_password: password });

            if (rpcError || !match) {
                return false;
            }

            setAdmin({ id: data.id, email: data.email, name: data.name });
            return true;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
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
