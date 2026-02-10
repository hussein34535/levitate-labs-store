import { Link } from "react-router-dom";
import { Star, ArrowRight, Zap } from "lucide-react";
import productBlack from "@/assets/product-black.png";
import productWhite from "@/assets/product-white.png";

const ProductShowcase = () => {
    return (
        <section id="products" className="relative py-16 md:py-28 overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section header */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary tracking-widest uppercase mb-4">
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

                {/* Product display */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-5xl mx-auto">
                    {/* Product images */}
                    <div className="relative group">
                        <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
                            <div className="aspect-square flex items-center justify-center p-8 md:p-12 bg-gradient-to-br from-secondary/30 to-background">
                                <img
                                    src={productBlack}
                                    alt="Floating Headphone Stand - Black"
                                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                        {/* Floating accent image */}
                        <div className="hidden md:block absolute -bottom-6 -right-6 w-32 h-32 rounded-xl overflow-hidden border border-primary/30 shadow-lg shadow-primary/10" style={{ animation: "float 4s ease-in-out infinite" }}>
                            <img
                                src={productWhite}
                                alt="White variant"
                                className="w-full h-full object-contain bg-card p-3"
                            />
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="space-y-6">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">4.8/5 (450+ reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl md:text-4xl font-display font-bold text-foreground">$86.58</span>
                            <span className="text-lg text-muted-foreground line-through">$115.44</span>
                            <span className="px-2.5 py-1 bg-primary/15 text-primary text-xs font-bold rounded-md tracking-wide">
                                SAVE 25%
                            </span>
                        </div>

                        {/* Features list */}
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                Magnetic levitation technology
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                Multi-coloured LED lighting
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                Available in Black & White
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                Free worldwide shipping
                            </li>
                        </ul>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Link
                                to="/products/floating-headphone-stand"
                                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-display font-bold text-sm tracking-widest uppercase rounded-md hover:box-glow-strong transition-shadow duration-300"
                            >
                                VIEW PRODUCT
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex items-center gap-6 pt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <span className="text-primary">📦</span> Free shipping
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-primary">🔒</span> Secure checkout
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-primary">⭐</span> 450+ reviews
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
