import { useState } from "react";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setCartOpen, cartCount } = useCart();

  const links = [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/products/floating-headphone-stand" },
    { label: "Track Order", href: "/track" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-14 md:h-16 px-4">
        <div className="flex items-center gap-8">
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-base md:text-xl font-display font-bold tracking-[0.15em] md:tracking-[0.2em] text-foreground whitespace-nowrap">
            ORBITA
          </h1>
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <button className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
            <Search size={20} />
          </button>
          <button className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
            <User size={20} />
          </button>
          <button
            className="relative text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-6 py-5 space-y-4">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block text-base font-display font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-5 pt-3 border-t border-border">
            <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search size={18} /> Search
            </a>
            <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={18} /> Account
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
