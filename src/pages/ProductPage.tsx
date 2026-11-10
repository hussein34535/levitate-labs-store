import { useState } from "react";
import { Star, ShoppingCart, Package, Truck, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/context/CartContext";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";

// Standard variant images
import productStdFront from "@/assets/product-standard-front.png";
import productStdAngle from "@/assets/product-standard-angle.png";
import productStdWhite from "@/assets/product-standard-white.png";
import productStdSide from "@/assets/product-standard-side.png";
import productStdDetail from "@/assets/product-standard-detail.png";

// LED variant images
import productLedBlack from "@/assets/product-black.png";
import productLedWhite from "@/assets/product-white.png";
import productLedFront from "@/assets/product-front.png";
import productLedAngle from "@/assets/product-angle.png";
import productLedSide from "@/assets/product-side.png";

import review1 from "@/assets/review-1.png";
import review2 from "@/assets/review-2.png";
import review3 from "@/assets/review-3.png";
import reviewLarge1 from "@/assets/review-large-1.png";
import reviewLarge2 from "@/assets/review-large-2.png";
import reviewLarge3 from "@/assets/review-large-3.png";

import setup1 from "@/assets/setup-1.png";
import setup2 from "@/assets/setup-2.png";

const variants = [
  {
    name: "Standard",
    subtitle: "Floating Headphone Stand",
    price: "$86.58",
    originalPrice: "$115.44",
    images: [productStdFront, productStdAngle, productStdWhite, productStdSide, productStdDetail],
    colors: [
      { name: "Black", image: productStdFront, imageIndex: 0 },
      { name: "White", image: productStdWhite, imageIndex: 2 },
    ],
  },
  {
    name: "Coloured LED's",
    subtitle: "Floating Headphone Stand - Coloured LED's",
    price: "$101.01",
    originalPrice: "$135.65",
    images: [productLedFront, productLedAngle, productLedBlack, productLedSide, productLedWhite],
    colors: [
      { name: "Black", image: productLedBlack, imageIndex: 2 },
      { name: "White", image: productLedWhite, imageIndex: 4 },
    ],
  },
];

const plugTypes = ["US standard", "European standard", "Australian standard", "British standard"];

const miniReviews = [
  { avatar: review1, name: "Gavin C", text: "Looks insane on my desk. The floating effect is very smooth and it holds my heavy headphones with no issues." },
  { avatar: review2, name: "Nikki S", text: "Honestly I just bought it for the aesthetics, but it's actually really sturdy. Everyone who sees it asks about it." },
  { avatar: review3, name: "Lochy S", text: "I just got a new bluetooth headset and this floating stand is the perfect flex. Super easy setup too." },
];

const bigReviews = [
  { image: reviewLarge1, name: "Ava G.", text: "Somehow it looks even better than expected in person.. IM OBSESSED" },
  { image: reviewLarge2, name: "Darcy M.", text: "This has to be the best upgrade I've ever made to my setup ngl" },
  { image: reviewLarge3, name: "Levi B.", text: "Easy to set up & instantly made my desk look way cooler!" },
];

const ProductPage = () => {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedPlug, setSelectedPlug] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  const variant = variants[selectedVariant];

  const handleVariantChange = (i: number) => {
    setSelectedVariant(i);
    setSelectedColor(0);
    setSelectedImage(0);
  };

  const handleAddToCart = () => {
    addItem({
      productId: "floating-headphone-stand",
      name: variant.subtitle,
      price: parseFloat(variant.price.replace("$", "")),
      image: variant.colors[selectedColor].image,
      variant: variant.name,
      color: variant.colors[selectedColor].name,
      plugType: plugTypes[selectedPlug],
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <AnnouncementBar />
      <Navbar />

      <main>
        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border group">
                <img
                  src={variant.images[selectedImage]}
                  alt={variant.subtitle}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-display font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider box-glow">
                  25% OFF
                </span>

                <button
                  onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : variant.images.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev < variant.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {variant.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-primary box-glow"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img src={img} alt={`${variant.subtitle} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Column */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-3">
                  {variant.subtitle}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs md:text-sm font-medium text-foreground">4.9</span>
                  <span className="text-xs md:text-sm text-muted-foreground">(128 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-2xl md:text-3xl font-display font-bold text-foreground">{variant.price}</span>
                  <span className="text-base md:text-lg text-muted-foreground line-through">{variant.originalPrice}</span>
                  <span className="text-xs md:text-sm font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Save 25%
                  </span>
                </div>

                {/* Select Variant */}
                <div className="mb-5">
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Style: <span className="text-muted-foreground">{variant.name}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {variants.map((v, i) => (
                      <button
                        key={v.name}
                        onClick={() => handleVariantChange(i)}
                        className={`px-4 py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                          selectedVariant === i
                            ? "border-2 border-primary bg-primary/10 text-primary box-glow"
                            : "border border-border bg-secondary/50 text-foreground hover:border-muted-foreground"
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Color */}
                <div className="mb-5">
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Color: <span className="text-muted-foreground">{variant.colors[selectedColor]?.name}</span>
                  </label>
                  <div className="flex gap-3">
                    {variant.colors.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedColor(i);
                          setSelectedImage(c.imageIndex);
                        }}
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedColor === i
                            ? "border-primary box-glow"
                            : "border-border hover:border-muted-foreground opacity-70"
                        }`}
                      >
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Plug Type */}
                <div className="mb-6">
                  <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                    Plug Type: <span className="text-muted-foreground">{plugTypes[selectedPlug]}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {plugTypes.map((plug, i) => (
                      <button
                        key={plug}
                        onClick={() => setSelectedPlug(i)}
                        className={`px-3 py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                          selectedPlug === i
                            ? "border-2 border-primary bg-primary/10 text-primary box-glow"
                            : "border border-border bg-secondary/50 text-foreground hover:border-muted-foreground"
                        }`}
                      >
                        {plug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 md:py-4 bg-primary text-primary-foreground font-display font-bold text-base md:text-lg rounded-md hover:bg-primary/90 transition-all box-glow flex items-center justify-center gap-2 mb-6"
                >
                  <ShoppingCart size={20} /> Add to cart
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 border-t border-border">
                  <div className="flex flex-col items-center text-center p-2">
                    <Truck size={20} className="text-primary mb-1" />
                    <span className="text-[11px] md:text-xs font-semibold text-foreground">Free Global Express</span>
                    <span className="text-[10px] text-muted-foreground">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-2">
                    <Package size={20} className="text-primary mb-1" />
                    <span className="text-[11px] md:text-xs font-semibold text-foreground">Dispatched in 24 Hours</span>
                    <span className="text-[10px] text-muted-foreground">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-2">
                    <Gift size={20} className="text-primary mb-1" />
                    <span className="text-[11px] md:text-xs font-semibold text-foreground">Risk-Free 30 Day Returns</span>
                    <span className="text-[10px] text-muted-foreground">Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Floating Tech Comparison */}
        <section className="py-12 md:py-20 bg-secondary/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">
                Next-Gen Aesthetics
              </span>
              <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
                Levitating vs Standard Stands
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Experience the magic of magnetic levitation. Drag the slider in the middle to compare our floating stand with traditional static stands.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <ImageComparisonSlider
                beforeImage={setup1}
                afterImage={setup2}
                beforeLabel="Floating Technology"
                afterLabel="Traditional Stand"
              />
            </div>
          </div>
        </section>

        {/* Section: Customer Reviews */}
        <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">
              Real Reviews
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-3">
              Loved by Gamers & Desk Enthusiasts
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">4.9 / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {miniReviews.map((r, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div className="flex text-yellow-400 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-foreground/90 italic mb-4 leading-relaxed font-body">
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover border border-border" />
                  <span className="text-xs font-semibold text-foreground">{r.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative max-w-3xl mx-auto bg-card border border-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square bg-secondary">
                <img
                  src={bigReviews[reviewIndex].image}
                  alt={bigReviews[reviewIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex text-yellow-400 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-foreground/90 font-medium italic mb-4">
                    "{bigReviews[reviewIndex].text}"
                  </p>
                  <p className="text-xs md:text-sm font-bold text-primary">— {bigReviews[reviewIndex].name}</p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
                  <span className="text-xs text-muted-foreground">
                    {reviewIndex + 1} of {bigReviews.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReviewIndex((prev) => (prev > 0 ? prev - 1 : bigReviews.length - 1))}
                      className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Previous review"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setReviewIndex((prev) => (prev < bigReviews.length - 1 ? prev + 1 : 0))}
                      className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Next review"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Specifications & FAQ */}
        <section className="py-12 md:py-20 bg-secondary/20 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Everything you need to know about setting up and using your ORBITA floating headphone stand.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="item-1" className="border border-border bg-card rounded-lg px-4 md:px-6">
                <AccordionTrigger className="text-sm md:text-base font-semibold text-foreground hover:no-underline hover:text-primary">
                  How does magnetic levitation work?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  The stand uses advanced electromagnetic levitation technology. The base creates a repulsive magnetic field that balances against gravity, suspending your headphones stably in mid-air.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border bg-card rounded-lg px-4 md:px-6">
                <AccordionTrigger className="text-sm md:text-base font-semibold text-foreground hover:no-underline hover:text-primary">
                  Will magnetic fields damage my headphones or electronics?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  No. The magnetic field is directional and isolated. It operates safely without affecting the drivers, bluetooth components, or battery of your headphones.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border bg-card rounded-lg px-4 md:px-6">
                <AccordionTrigger className="text-sm md:text-base font-semibold text-foreground hover:no-underline hover:text-primary">
                  What is the maximum weight limit?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  The stand comfortably supports headphones up to 500g (1.1 lbs), which includes all mainstream audiophile and gaming headsets (AirPods Max, Sennheiser HD600, SteelSeries Arctis, Sony WH-1000XM5, etc.).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border bg-card rounded-lg px-4 md:px-6">
                <AccordionTrigger className="text-sm md:text-base font-semibold text-foreground hover:no-underline hover:text-primary">
                  What happens if the power cuts out?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  In case of power interruption, the built-in safety magnet instantly draws the floating headpiece upward to snap safely to the top arch, preventing your headphones from falling.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border bg-card rounded-lg px-4 md:px-6">
                <AccordionTrigger className="text-sm md:text-base font-semibold text-foreground hover:no-underline hover:text-primary">
                  What comes in the box?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Each box includes: 1x Floating Stand Base & Arch, 1x Magnetic Hanger Module, 1x Power Adapter (with your chosen plug type), 1x Setup Auxiliary Tool, and 1x User Manual.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky Bottom Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-between z-40">
        <div>
          <span className="text-sm font-bold text-foreground block">{variant.price}</span>
          <span className="text-[10px] text-muted-foreground line-through">{variant.originalPrice}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-primary text-primary-foreground font-display font-bold text-xs px-4 py-2.5 rounded-md whitespace-nowrap hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
