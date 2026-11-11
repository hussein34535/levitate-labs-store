import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/admin/orders" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Read straight from the form so browser autofill (which can set the DOM
    // value without firing React's onChange) is still picked up.
    const form = e.currentTarget;
    const emailValue = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const passwordValue = (form.elements.namedItem("password") as HTMLInputElement).value;
    const success = await login(emailValue, passwordValue);
    if (success) {
      toast.success("Welcome back to ORBITA Admin!");
      navigate("/admin/orders");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">ORBITA Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                autoComplete="username"
                spellCheck={false}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@orbita.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
