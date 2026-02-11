import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
    ArrowLeft, Package, Clock, Truck, CheckCircle, XCircle,
    Mail, MapPin, Hash, Send, Save
} from "lucide-react";

interface OrderItem {
    id: string;
    product_name: string;
    variant: string;
    quantity: number;
    price: number;
}

interface StatusHistory {
    id: string;
    old_status: string | null;
    new_status: string;
    note: string | null;
    created_at: string;
}

interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    shipping_address: string;
    total_amount: number;
    status: string;
    tracking_number: string | null;
    carrier: string | null;
    tracking_url: string | null;
    notes: string | null;
    created_at: string;
}

const statusSteps = ["pending", "processing", "shipped", "delivered"];

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Package }> = {
    pending: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: Clock },
    processing: { color: "text-blue-400", bg: "bg-blue-400/10", icon: Package },
    shipped: { color: "text-purple-400", bg: "bg-purple-400/10", icon: Truck },
    delivered: { color: "text-green-400", bg: "bg-green-400/10", icon: CheckCircle },
    cancelled: { color: "text-red-400", bg: "bg-red-400/10", icon: XCircle },
};

const AdminOrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [history, setHistory] = useState<StatusHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Editable fields
    const [newStatus, setNewStatus] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [carrier, setCarrier] = useState("");
    const [trackingUrl, setTrackingUrl] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        if (!id) return;
        setLoading(true);

        const [orderRes, itemsRes, historyRes] = await Promise.all([
            supabase.from("orders").select("*").eq("id", id).single(),
            supabase.from("order_items").select("*").eq("order_id", id),
            supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at", { ascending: true }),
        ]);

        if (orderRes.data) {
            setOrder(orderRes.data);
            setNewStatus(orderRes.data.status);
            setTrackingNumber(orderRes.data.tracking_number || "");
            setCarrier(orderRes.data.carrier || "");
            setTrackingUrl(orderRes.data.tracking_url || "");
            setNotes(orderRes.data.notes || "");
        }
        if (itemsRes.data) setItems(itemsRes.data);
        if (historyRes.data) setHistory(historyRes.data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!order || !id) return;
        setSaving(true);

        try {
            // Update order
            const { error } = await supabase
                .from("orders")
                .update({
                    status: newStatus,
                    tracking_number: trackingNumber || null,
                    carrier: carrier || null,
                    tracking_url: trackingUrl || null,
                    notes: notes || null,
                })
                .eq("id", id);

            if (error) throw error;

            // Add status history if changed
            if (newStatus !== order.status) {
                await supabase.from("order_status_history").insert({
                    order_id: id,
                    old_status: order.status,
                    new_status: newStatus,
                    note: `Status changed from ${order.status} to ${newStatus}`,
                });
            }

            toast.success("Order updated successfully");
            fetchOrder();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update order");
        } finally {
            setSaving(false);
        }
    };

    const handleSendEmail = async () => {
        if (!order) return;
        toast.info("Email feature requires Resend API key setup. See implementation plan.");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-500">
                <Package size={40} className="mb-3 opacity-30" />
                <p>Order not found</p>
                <Link to="/admin/orders" className="text-blue-400 text-sm mt-2">← Back to Orders</Link>
            </div>
        );
    }

    const currentStepIndex = statusSteps.indexOf(order.status);

    return (
        <div className="p-6 lg:p-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    to="/admin/orders"
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        Order #{order.id.slice(0, 8)}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.status]?.color} ${statusConfig[order.status]?.bg}`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500">
                        Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Progress */}
                    <div className="bg-[#111118] border border-white/5 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-4">Order Progress</h3>
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-white/10" />
                            <div
                                className="absolute top-4 left-[10%] h-0.5 bg-blue-500 transition-all duration-500"
                                style={{ width: `${Math.max(0, currentStepIndex / (statusSteps.length - 1) * 80)}%` }}
                            />
                            {statusSteps.map((step, i) => {
                                const isDone = i <= currentStepIndex;
                                const config = statusConfig[step];
                                const Icon = config.icon;
                                return (
                                    <div key={step} className="flex flex-col items-center relative z-10">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDone ? "bg-blue-600 text-white" : "bg-white/5 text-gray-600 border border-white/10"
                                                }`}
                                        >
                                            <Icon size={14} />
                                        </div>
                                        <span className={`text-xs mt-2 capitalize ${isDone ? "text-white" : "text-gray-600"}`}>
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-[#111118] border border-white/5 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div>
                                        <p className="text-sm text-white font-medium">{item.product_name}</p>
                                        <p className="text-xs text-gray-500">{item.variant} × {item.quantity}</p>
                                    </div>
                                    <p className="text-sm text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                <p className="text-sm font-bold text-white">Total</p>
                                <p className="text-lg font-bold text-white">${order.total_amount?.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status History */}
                    <div className="bg-[#111118] border border-white/5 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-4">Status History</h3>
                        {history.length === 0 ? (
                            <p className="text-sm text-gray-500">No status changes yet</p>
                        ) : (
                            <div className="space-y-3">
                                {history.map((h) => (
                                    <div key={h.id} className="flex gap-3 items-start">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-sm text-white">
                                                {h.old_status && (
                                                    <span className="text-gray-500">{h.old_status}</span>
                                                )}
                                                {h.old_status && " → "}
                                                <span className="font-medium">{h.new_status}</span>
                                            </p>
                                            {h.note && <p className="text-xs text-gray-500">{h.note}</p>}
                                            <p className="text-xs text-gray-600">
                                                {new Date(h.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-[#111118] border border-white/5 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-4">Customer</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Mail size={14} className="text-gray-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm text-white">{order.customer_name}</p>
                                    <p className="text-xs text-gray-500">{order.customer_email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={14} className="text-gray-500 mt-0.5 shrink-0" />
                                <p className="text-sm text-gray-400">{order.shipping_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Update Status */}
                    <div className="bg-[#111118] border border-white/5 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-4">Update Order</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                                >
                                    {statusSteps.map((s) => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                    <Hash size={12} /> Tracking Number
                                </label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="e.g. 1Z999AA10123456784"
                                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                    <Truck size={12} /> Carrier
                                </label>
                                <select
                                    value={carrier}
                                    onChange={(e) => setCarrier(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                                >
                                    <option value="">Select carrier</option>
                                    <option value="DHL">DHL</option>
                                    <option value="FedEx">FedEx</option>
                                    <option value="UPS">UPS</option>
                                    <option value="USPS">USPS</option>
                                    <option value="Aramex">Aramex</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">Tracking URL</label>
                                <input
                                    type="url"
                                    value={trackingUrl}
                                    onChange={(e) => setTrackingUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Internal notes..."
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={14} />
                                            Save
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleSendEmail}
                                    className="h-9 px-4 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-all"
                                >
                                    <Send size={14} />
                                    Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
