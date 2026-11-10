import { Link } from "react-router-dom";
import { Star, ArrowRight, Zap } from "lucide-react";
import productBlack from "@/assets/product-black.png";
import productWhite from "@/assets/product-white.png";

const ProductShowcase = () => {
  return (
    <section id="products" className="relative py-16 md:py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-display font-semibold text-primary tracking-wider uppercase mb-4">
            <Zap size={12} />
            Featured Product
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
            Floating Headphone Stand
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            Magnetic levitation technology meets premium design. Your headphones deserve to float.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          {/* Standard Edition */}
          <div className="group relative bg-card/50 border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all duration-300">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-b from-secondary/50 to-background flex items-center justify-center p-6">
              <img
                src={productBlack}
                alt="Floating Headphone Stand - Obsidian Black"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Standard Edition
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star size={14} className="fill-amber-400" />
                  <span className="font-semibold text-foreground">4.9</span>
                </div>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                Obsidian Black / Arctic White
              </h3>
              <p className="text-xs text-muted-foreground">
                Matte anodized finish with true electromagnetic levitation.
              </p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-display text-foreground">$86.58</span>
                  <span className="text-xs text-muted-foreground line-through">$115.44</span>
                </div>
                <Link
                  to="/products/floating-headphone-stand"
                  className="inline-flex items-center gap-2 text-xs font-display font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Coloured LED's Edition */}
          <div className="group relative bg-card/50 border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all duration-300">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-b from-secondary/50 to-background flex items-center justify-center p-6">
              <img
                src={productWhite}
                alt="Floating Headphone Stand - Coloured LED's"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Coloured LED's Edition
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star size={14} className="fill-amber-400" />
                  <span className="font-semibold text-foreground">4.9</span>
                </div>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                RGB Ambient LED Edition
              </h3>
              <p className="text-xs text-muted-foreground">
                Available in Black or White with customizable RGB ambient lighting.
              </p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-display text-foreground">$101.01</span>
                  <span className="text-xs text-muted-foreground line-through">$135.65</span>
                </div>
                <Link
                  to="/products/floating-headphone-stand"
                  className="inline-flex items-center gap-2 text-xs font-display font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
