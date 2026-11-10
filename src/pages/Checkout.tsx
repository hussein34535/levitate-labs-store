import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MapPin, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CATALOG_PRICES: Record<string, number> = {
  Standard: 86.58,
  "Coloured LED's": 101.01,
};

const COUNTRIES = [
  "Egypt", "Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", "Bahrain", "Oman",
  "Jordan", "Lebanon", "Iraq", "Morocco", "Tunisia", "Algeria", "Libya",
  "United States", "United Kingdom", "Canada", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Austria", "Switzerland", "Sweden", "Norway", "Denmark",
  "Australia", "Japan", "South Korea", "China", "India", "Brazil", "Mexico",
  "Turkey", "South Africa", "Nigeria", "Kenya", "Pakistan", "Bangladesh",
  "Malaysia", "Singapore", "Thailand", "Vietnam", "Philippines", "Indonesia",
  "Poland", "Czech Republic", "Romania", "Hungary", "Portugal", "Greece",
  "Ireland", "Finland", "New Zealand", "Russia", "Ukraine"
];

const Checkout = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");

  // حساب الإجمالي باستخدام الأسعار المعتمدة لمنع التلاعب من localStorage
  const verifiedTotal = items.reduce((sum, item) => {
    const unitPrice = CATALOG_PRICES[item.variant] ?? item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    const firstName = (formData.get("firstName") as string).trim();
    const lastName = (formData.get("lastName") as string).trim();
    const address1 = (formData.get("address1") as string).trim();
    const address2 = ((formData.get("address2") as string) || "").trim();
    const city = (formData.get("city") as string).trim();
    const state = (formData.get("state") as string).trim();
    const zip = (formData.get("zip") as string).trim();

    const fullShippingAddress = [
      address1,
      address2,
      city,
      state,
      zip,
      country,
    ]
      .filter(Boolean)
      .join(", ");

    const orderData = {
      customer_name: `${firstName} ${lastName}`,
      customer_email: (formData.get("email") as string).trim(),
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_phone: (formData.get("phone") as string).trim(),
      shipping_address: fullShippingAddress,
      shipping_address_line1: address1,
      shipping_address_line2: address2 || null,
      shipping_city: city,
      shipping_state: state,
      shipping_zip: zip,
      shipping_country: country,
      total_amount: Number(verifiedTotal.toFixed(2)),
      status: "pending",
    };

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => {
        const verifiedPrice = CATALOG_PRICES[item.variant] ?? item.price;
        const fullVariantDetails = [
          item.variant,
          item.color,
          item.plugType,
        ]
          .filter(Boolean)
          .join(" / ");

        return {
          order_id: order.id,
          product_id: item.productId,
          product_name: item.name,
          variant: fullVariantDetails,
          quantity: item.quantity,
          price: verifiedPrice,
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // استدعاء Edge Function مع إرسال توكن المصادقة التلقائي من Supabase
      supabase.functions
        .invoke("send-order-confirmation", {
          body: {
            orderId: order.id,
            customerName: orderData.customer_name,
            customerEmail: orderData.customer_email,
            items: orderItems,
            totalAmount: orderData.total_amount,
            shippingAddress: orderData.shipping_address,
          },
        })
        .catch((err) => console.error("Email send error:", err));

      toast.success("Order placed successfully! Order ID: " + order.id.slice(0, 8));
      clearCart();
      navigate("/track?order=" + order.id);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Package size={48} className="text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some items to get started</p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 gap-2 pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft size={16} /> Back to Store
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div className="space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-mono">1</span>
                  Contact Information
                </h2>
                <div className="space-y-4 pl-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-mono">2</span>
                  <MapPin size={20} className="text-primary" />
                  Shipping Address
                </h2>
                <div className="space-y-4 pl-10">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <select
                      id="country"
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="" disabled>Select country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input id="address1" name="address1" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input id="address2" name="address2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" name="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province *</Label>
                      <Input id="state" name="state" required />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-[200px]">
                    <Label htmlFor="zip">ZIP / Postal Code *</Label>
                    <Input id="zip" name="zip" required />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-mono">3</span>
                  Payment Method
                </h2>
                <div className="pl-10">
                  <RadioGroup defaultValue="card">
                    <div className="flex items-center space-x-2 border border-border p-4 rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer font-medium">Credit Card</Label>
                      <div className="flex gap-2">
                        <div className="w-8 h-5 bg-foreground/20 rounded"></div>
                        <div className="w-8 h-5 bg-foreground/20 rounded"></div>
                      </div>
                    </div>
                  </RadioGroup>
                  <div className="mt-4 p-4 border border-border rounded-lg bg-secondary/20 text-sm text-muted-foreground">
                    Payment is simulated for this demo. No actual charge will be made.
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:pl-12">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 sticky top-24">
              <h3 className="text-xl font-display font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => {
                  const unitPrice = CATALOG_PRICES[item.variant] ?? item.price;
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-md bg-secondary border border-border overflow-hidden shrink-0 flex items-center justify-center p-2">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.variant} / {item.color}
                          {item.plugType ? ` / ${item.plugType}` : ""}
                        </p>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">${(unitPrice * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="mb-6" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${verifiedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg">Total</span>
                <span className="font-display font-bold text-2xl">${verifiedTotal.toFixed(2)}</span>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                className="w-full py-6 text-lg font-bold tracking-wide uppercase"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 size={12} className="text-green-500" />
                <span>Secure Checkout with SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
