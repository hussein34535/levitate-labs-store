import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Cart = () => {
    const { cartOpen, setCartOpen, items, updateQuantity, removeItem, cartTotal } = useCart();

    return (
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag size={20} />
                        Your Cart
                    </SheetTitle>
                </SheetHeader>

                <Separator className="my-4" />

                <ScrollArea className="flex-1 -mx-6 px-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                            <ShoppingBag size={48} className="text-muted-foreground/50" />
                            <p className="text-muted-foreground">Your cart is empty</p>
                            <Button onClick={() => setCartOpen(false)}>Start Shopping</Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 rounded-lg border border-border overflow-hidden bg-secondary/50 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {item.variant} / {item.color}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2 border border-border rounded-md h-8">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 h-full hover:bg-secondary transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 h-full hover:bg-secondary transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors self-start"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {items.length > 0 && (
                    <div className="pt-6 mt-auto border-t border-border space-y-4">
                        <div className="flex items-center justify-between text-base font-medium">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Taxes and shipping calculated at checkout
                        </p>
                        <Link to="/checkout" onClick={() => setCartOpen(false)}>
                            <Button className="w-full h-12 text-base font-bold tracking-wide uppercase">
                                Checkout
                            </Button>
                        </Link>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default Cart;
