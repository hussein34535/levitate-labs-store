import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";

interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    status: string;
    tracking_number: string | null;
    created_at: string;
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Package }> = {
    pending: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: Clock },
    processing: { color: "text-blue-400", bg: "bg-blue-400/10", icon: Package },
    shipped: { color: "text-purple-400", bg: "bg-purple-400/10", icon: Truck },
    delivered: { color: "text-green-400", bg: "bg-green-400/10", icon: CheckCircle },
    cancelled: { color: "text-red-400", bg: "bg-red-400/10", icon: XCircle },
};

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
        setLoading(false);
    };

    const filtered = orders.filter((order) => {
        const matchesSearch =
            search === "" ||
            order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
            order.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
            order.id.includes(search);
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        processing: orders.filter((o) => o.status === "processing").length,
        shipped: orders.filter((o) => o.status === "shipped").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Orders</h1>
                <p className="text-sm text-gray-500">Manage and track all customer orders</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {[
                    { label: "Total", value: stats.total, color: "text-white", bg: "bg-white/5" },
                    { label: "Pending", value: stats.pending, color: "text-yellow-400", bg: "bg-yellow-400/5" },
                    { label: "Processing", value: stats.processing, color: "text-blue-400", bg: "bg-blue-400/5" },
                    { label: "Shipped", value: stats.shipped, color: "text-purple-400", bg: "bg-purple-400/5" },
                    { label: "Delivered", value: stats.delivered, color: "text-green-400", bg: "bg-green-400/5" },
                ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} border border-white/5 rounded-xl p-4`}>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, or order ID..."
                        className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                </div>
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 pl-10 pr-8 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer transition-all"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Package size={40} className="mb-3 opacity-30" />
                        <p className="text-sm">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Order</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Customer</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Amount</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((order) => {
                                    const config = statusConfig[order.status] || statusConfig.pending;
                                    const StatusIcon = config.icon;
                                    return (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-300 font-mono">
                                                    #{order.id.slice(0, 8)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-white font-medium">{order.customer_name}</p>
                                                <p className="text-xs text-gray-500">{order.customer_email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-white font-semibold">
                                                    ${order.total_amount?.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
                                                    <StatusIcon size={12} />
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 transition-all"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
