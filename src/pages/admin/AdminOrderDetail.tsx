import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  ArrowLeft, Package, Clock, Truck, CheckCircle, XCircle,
  Mail, Phone, MapPin, Hash, Send, Save
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
  customer_phone: string | null;
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

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    const [orderRes, itemsRes, historyRes] = await Promise.all([
      supabase.from("orders").select("*").eq("id", id).single(),
      supabase.from("order_items").select("*").eq("order_id", id),
      supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at", { ascending: false }),
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
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleSave = async () => {
    if (!order || !id) return;
    setSaving(true);

    try {
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
    try {
      const { error } = await supabase.functions.invoke("send-order-confirmation", {
        body: {
          orderId: order.id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          items,
          totalAmount: order.total_amount,
          shippingAddress: order.shipping_address,
          status: newStatus,
          trackingNumber: trackingNumber || null,
          carrier: carrier || null,
          trackingUrl: trackingUrl || null,
        },
      });

      if (error) {
        // فتح البريد المباشر كبديل فوري إذا لم تكن دالة Edge Function مفعلة
        const subject = encodeURIComponent(`ORBITA Order #${order.id.slice(0, 8)} Update`);
        const body = encodeURIComponent(
          `Hi ${order.customer_name},\n\nYour ORBITA order (#${order.id.slice(0, 8)}) status is now: ${newStatus.toUpperCase()}.\n${
            trackingNumber ? `Tracking Number (${carrier || "Carrier"}): ${trackingNumber}\n` : ""
          }${trackingUrl ? `Track here: ${trackingUrl}\n` : ""}\nThank you for shopping with ORBITA!`
        );
        window.open(`mailto:${order.customer_email}?subject=${subject}&body=${body}`, "_blank");
        return;
      }

      toast.success("Update email sent to customer!");
    } catch {
      toast.error("Could not trigger email function");
    }
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

  const currentStepIdx = statusSteps.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link to="/admin/orders" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-white">Order #{order.id.slice(0, 8)}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${statusConfig[order.status]?.bg || "bg-gray-500/10"} ${statusConfig[order.status]?.color || "text-gray-400"}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {!isCancelled && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-5">
          <p className="text-xs font-medium text-gray-400 mb-4">Fulfillment Status</p>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-6 right-6 top-4 h-0.5 bg-white/10 -z-0">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${(Math.max(0, currentStepIdx) / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            {statusSteps.map((step, idx) => {
              const isDone = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-white/10 text-gray-500 border border-white/10"
                    } ${isCurrent ? "ring-4 ring-blue-500/20" : ""}`}
                  >
                    {idx + 1}
                  </div>
                  <span className={`text-xs font-medium capitalize ${isDone ? "text-white" : "text-gray-500"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Package size={16} className="text-blue-400" />
              Order Items ({items.length})
            </h2>
            <div className="divide-y divide-white/5">
              {items.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{item.product_name}</p>
                    <p className="text-xs text-gray-400">Options: {item.variant}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-white">${item.price.toFixed(2)} × {item.quantity}</p>
                    <p className="text-xs font-mono font-semibold text-blue-400">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between font-semibold text-sm text-white">
              <span>Total Amount</span>
              <span className="font-mono text-lg text-blue-400">${order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-gray-400 font-medium">Customer Name</p>
                <p className="text-white font-semibold text-sm">{order.customer_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 font-medium">Email Address</p>
                <p className="text-white flex items-center gap-1.5 break-all">
                  <Mail size={12} className="text-gray-400 shrink-0" />
                  {order.customer_email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 font-medium">Phone Number</p>
                <p className="text-white flex items-center gap-1.5">
                  <Phone size={12} className="text-gray-400 shrink-0" />
                  {order.customer_phone || "Not provided"}
                </p>
              </div>
              <div className="md:col-span-3 space-y-1 pt-2 border-t border-white/5">
                <p className="text-gray-400 font-medium">Shipping Address</p>
                <p className="text-gray-300 leading-relaxed bg-black/20 p-3 rounded-lg font-mono">
                  {order.shipping_address}
                </p>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              Status History
            </h2>
            {history.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No history recorded yet.</p>
            ) : (
              <div className="relative pl-4 border-l border-white/10 space-y-4 text-xs">
                {history.map((h) => (
                  <div key={h.id} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-black/40" />
                    <p className="text-white font-medium">
                      Status updated to <span className="text-blue-400 font-semibold uppercase">{h.new_status}</span>
                    </p>
                    {h.note && <p className="text-gray-400 mt-0.5">{h.note}</p>}
                    <p className="text-[10px] text-gray-500 mt-1">{new Date(h.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Tracking Form */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Update Status & Tracking</h2>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400">Order Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                {statusSteps.map((s) => (
                  <option key={s} value={s} className="bg-gray-900 text-white capitalize">
                    {s}
                  </option>
                ))}
                <option value="cancelled" className="bg-gray-900 text-red-400">Cancelled</option>
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
                className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                <Truck size={12} /> Carrier
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
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
                className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Internal notes..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
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
                className="h-9 px-4 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Send size={14} />
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
