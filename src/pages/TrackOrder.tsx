import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Package, Clock, Truck, CheckCircle, XCircle, ExternalLink, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

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
  created_at: string;
}

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

const statusSteps = ["pending", "processing", "shipped", "delivered"];

const statusInfo: Record<string, { label: string; description: string; icon: typeof Package; color: string }> = {
  pending: { label: "Order Placed", description: "We've received your order", icon: Clock, color: "text-yellow-400" },
  processing: { label: "Processing", description: "Your order is being prepared", icon: Package, color: "text-blue-400" },
  shipped: { label: "Shipped", description: "Your order is on its way", icon: Truck, color: "text-purple-400" },
  delivered: { label: "Delivered", description: "Your order has arrived", icon: CheckCircle, color: "text-green-400" },
  cancelled: { label: "Cancelled", description: "This order was cancelled", icon: XCircle, color: "text-red-400" },
};

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchOrder = useCallback(async (searchQuery: string) => {
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) return;

    setLoading(true);
    setSearched(true);

    let res;
    if (cleanQuery.includes("@")) {
      res = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", cleanQuery)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    } else {
      res = await supabase
        .from("orders")
        .select("*")
        .eq("id", cleanQuery)
        .maybeSingle();
    }

    if (res.data) {
      setOrder(res.data);
      const [itemsRes, historyRes] = await Promise.all([
        supabase.from("order_items").select("*").eq("order_id", res.data.id),
        supabase
          .from("order_status_history")
          .select("*")
          .eq("order_id", res.data.id)
          .order("created_at", { ascending: true }),
      ]);
      if (itemsRes.data) setItems(itemsRes.data);
      if (historyRes.data) setHistory(historyRes.data);
    } else {
      setOrder(null);
      setItems([]);
      setHistory([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const orderId = searchParams.get("order") || searchParams.get("orderId");
    if (orderId) {
      setQuery(orderId);
      searchOrder(orderId);
    }
  }, [searchParams, searchOrder]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchOrder(query.trim());
  };

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft size={14} />
            Back to Store
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Track Your Order
            </h1>
            <p className="text-muted-foreground">
              Enter your order ID or email to check your order status
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-10">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Order ID or email address"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Searching..." : "Track"}
              </button>
            </div>
          </form>

          {searched && !loading && !order && (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No order found. Please check your order ID or email address.</p>
            </div>
          )}

          {order && (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo[order.status]?.color || "text-foreground"} bg-secondary`}>
                    {(() => {
                      const Icon = statusInfo[order.status]?.icon || Package;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {statusInfo[order.status]?.label || order.status}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {statusInfo[order.status]?.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between relative px-4">
                  <div className="absolute top-4 left-[8%] right-[8%] h-1 rounded-full bg-secondary" />
                  <div
                    className="absolute top-4 left-[8%] h-1 rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: order.status === "cancelled" ? "0%" : `${Math.max(0, currentStepIndex) / (statusSteps.length - 1) * 84}%`
                    }}
                  />
                  {statusSteps.map((step, i) => {
                    const isDone = i <= currentStepIndex && order.status !== "cancelled";
                    const isCurrent = i === currentStepIndex;
                    const info = statusInfo[step];
                    const Icon = info.icon;
                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : isDone
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <Icon size={14} />
                        </div>
                        <span className={`text-xs mt-2 font-medium ${isDone ? "text-foreground" : "text-muted-foreground"}`}>
                          {info.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {order.tracking_number && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Truck size={16} />
                    Tracking Information
                  </h3>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {order.carrier && <span className="font-medium text-foreground">{order.carrier}: </span>}
                        <span className="font-mono">{order.tracking_number}</span>
                      </p>
                    </div>
                    {order.tracking_url && (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                      >
                        <ExternalLink size={12} />
                        Track Package
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm text-foreground">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">{item.variant} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-lg font-display font-bold text-foreground">${order.total_amount?.toFixed(2)}</span>
                </div>
              </div>

              {history.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">Updates</h3>
                  <div className="space-y-4">
                    {[...history].reverse().map((h, i) => (
                      <div key={h.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground"}`} />
                          {i < history.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border mt-1" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm text-foreground font-medium capitalize">{h.note || h.new_status}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(h.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Order #{order.id.slice(0, 8)} · Placed {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
