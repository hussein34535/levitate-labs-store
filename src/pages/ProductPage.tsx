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

import productFront from "@/assets/product-standard-front.png";
import productAngle from "@/assets/product-standard-angle.png";
import productWhite from "@/assets/product-standard-white.png";
import productSide from "@/assets/product-standard-side.png";
import productDetail from "@/assets/product-standard-detail.png";

import review1 from "@/assets/review-1.png";
import review2 from "@/assets/review-2.png";
import review3 from "@/assets/review-3.png";
import reviewLarge1 from "@/assets/review-large-1.png";
import reviewLarge2 from "@/assets/review-large-2.png";
import reviewLarge3 from "@/assets/review-large-3.png";

import productLed from "@/assets/product-black.png";
import setup1 from "@/assets/setup-1.png";
import setup2 from "@/assets/setup-2.png";

const colorVariants = [
  { name: "Black", image: productFront },
  { name: "White", image: productWhite },
];

const allImages = [productFront, productAngle, productWhite, productSide, productDetail];

const plugTypes = ["US standard", "European standard", "Australian standard", "British standard"];

const miniReviews = [
  { avatar: review1, name: "Gavin C", text: "Looks insane on my desk. The floating effect is very smooth and it holds my headset perfectly." },
  { avatar: review2, name: "Nikki S", text: "Honestly I just bought it for the aesthetics, but it's actually really practical too. Absolutely loving it!" },
  { avatar: review3, name: "Lochy S", text: "I just got a new bluetooth headset and this floating stand is the perfect addition I needed for my set up" },
];

const bigReviews = [
  { image: reviewLarge1, name: "Ava G.", text: "Somehow it looks even better than expected in person.. IM OBSESSED!" },
  { image: reviewLarge2, name: "Darcy M.", text: "This has to be the best upgrade I've ever made to my setup ngl" },
  { image: reviewLarge3, name: "Levi B.", text: "Easy to set up & instantly made my desk look way cooler!" },
];

const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedPlug, setSelectedPlug] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />

      <main>
        {/* Product Section */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-16">
              {/* Image Gallery */}
              <div className="space-y-3">
                <div className="bg-card rounded-lg overflow-hidden aspect-square flex items-center justify-center border border-border">
                  <img
                    src={allImages[selectedImage]}
                    alt="Floating Headphone Stand"
                    className="w-full h-full object-contain p-4 md:p-8 animate-float"
                  />
                </div>
                <div className="grid grid-cols-5 gap-1.5 md:gap-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === i
                          ? "border-primary box-glow"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain bg-card p-0.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-5">
                <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground leading-tight">
                  Floating Headphone Stand
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={s <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/50 text-yellow-400/50"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">Rated 4.8/5</span>
                  <span className="text-sm text-muted-foreground">(450+ happy customers)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <span className="text-2xl md:text-3xl font-display font-bold text-foreground">$86.58</span>
                  <span className="text-base md:text-lg text-muted-foreground line-through">$115.44</span>
                  <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    🏷 SAVE 25%
                  </span>
                </div>

                {/* Color Selector */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Colours - <span className="text-foreground">{colorVariants[selectedColor].name}</span>
                  </p>
                  <div className="flex gap-2.5">
                    {colorVariants.map((variant, i) => (
                      <button
                        key={variant.name}
                        onClick={() => {
                          setSelectedColor(i);
                          setSelectedImage(i === 0 ? 0 : 2);
                        }}
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedColor === i
                            ? "border-primary box-glow"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <img src={variant.image} alt={variant.name} className="w-full h-full object-contain bg-card p-0.5" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plug Type */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Plug Type - <span className="text-foreground">{plugTypes[selectedPlug]}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {plugTypes.map((plug, i) => (
                      <button
                        key={plug}
                        onClick={() => setSelectedPlug(i)}
                        className={`px-3 py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                          selectedPlug === i
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {plug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Cart */}
                <button className="w-full py-3.5 md:py-4 bg-primary text-primary-foreground font-display font-bold text-sm tracking-widest uppercase rounded-md hover:box-glow-strong active:scale-[0.98] transition-all duration-200">
                  Add to Cart
                </button>

                {/* Shipping Timeline */}
                <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-[15%] right-[15%] h-0.5 bg-border" />
                    {[
                      { icon: Package, date: "Feb 10th", label: "Ordered" },
                      { icon: Truck, date: "Feb 11th - Feb 12th", label: "Shipped" },
                      { icon: Gift, date: "Feb 24th - Feb 28th", label: "Delivered" },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <step.icon size={18} className="text-primary" />
                        </div>
                        <span className="text-xs font-bold text-foreground text-center">{step.date}</span>
                        <span className="text-[10px] text-muted-foreground">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Reviews Carousel */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={miniReviews[reviewIndex].avatar}
                      alt={miniReviews[reviewIndex].name}
                      className="w-10 h-10 rounded-full object-cover border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">
                        {miniReviews[reviewIndex].text}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium text-foreground">{miniReviews[reviewIndex].name}</span>
                        <span className="text-primary text-xs">✓</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={10} className="fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-1.5 mt-3">
                    {miniReviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          reviewIndex === i ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Second Announcement Marquee */}
        <div className="bg-primary/10 border-y border-primary/20 py-2.5 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="mx-6 text-xs font-bold tracking-wider text-primary/80">
                {i % 3 === 0 ? "QUALITY TESTED ✅" : i % 3 === 1 ? "FREE SHIPPING WORLDWIDE 🌎" : "25% OFF VALENTINES DAY SALE"}
              </span>
            ))}
          </div>
        </div>

        {/* Approved by Gamers */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground text-center mb-8 md:mb-12">
              Approved by gamers..
            </h2>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {bigReviews.map((review, i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden group">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-display font-bold text-foreground">{review.name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collapsible Content / FAQ */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Accordion type="multiple" className="space-y-0">
              <AccordionItem value="desc" className="border-b border-border">
                <AccordionTrigger className="text-foreground font-display text-sm md:text-base">
                  🎧 Description
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2 text-xs md:text-sm">
                  <p>Our headphone stand uses magnetic levitation technology to make your headphones appear as if they're floating.</p>
                  <p>Designed for durability and style.</p>
                  <p>Engineered for stability and precision.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="included" className="border-b border-border">
                <AccordionTrigger className="text-foreground font-display text-sm md:text-base">
                  ❓ What's Included
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-1 text-xs md:text-sm">
                  <p>1 x Levitate Labs headphone stand</p>
                  <p>1 x Magnet</p>
                  <p>1 x Power cable</p>
                  <p>1 x User guide</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="specs" className="border-b border-border">
                <AccordionTrigger className="text-foreground font-display text-sm md:text-base">
                  ✨ Specifications
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2 text-xs md:text-sm">
                  <p><strong className="text-foreground">Stand Dimensions:</strong> 17.3" L x 9.37" W x 2.83" H</p>
                  <p><strong className="text-foreground">Weight Capacity:</strong> 200-600 grams - 1.2 lbs</p>
                  <p><strong className="text-foreground">Materials:</strong> Acrylic/Plexiglass, Plastic</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-b border-border">
                <AccordionTrigger className="text-foreground font-display text-sm md:text-base">
                  🚚 Shipping Information
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2 text-xs md:text-sm">
                  <p>📦 <strong className="text-foreground">Processing Time:</strong> 1-3 business days</p>
                  <p>✈️ <strong className="text-foreground">Shipping Time:</strong> 7-14 business days worldwide with tracking</p>
                  <p>We ensure every floating headphone stand passes quality checks and is securely packaged before shipment.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Elevate Your Setup */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground text-center mb-3">
              Elevate your setup
            </h2>
            <p className="text-muted-foreground text-center text-sm mb-8">
              Available in black or white. Built to complement any desk aesthetic
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6 max-w-3xl mx-auto">
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={setup1} alt="Black setup" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={setup2} alt="White setup" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground text-center mb-8">
              FAQ's
            </h2>
            <Accordion type="multiple">
              <AccordionItem value="faq1">
                <AccordionTrigger className="text-foreground font-display text-sm md:text-base">
                  How does it levitate?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-xs md:text-sm">
                  Using a quad-blade fan system and precision magnets, our headphone stand creates a smooth levitation effect that keeps your headphones securely suspended in mid-air.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq2">
                <AccordionTrigger className="text-foreground font-display text-sm md:text-base">
                  Is it compatible with all headphones/headsets?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-xs md:text-sm">
                  Levitate Labs headphone stand is crafted to support a wide range of headsets/headphone shapes and sizes, making it versatile for various models.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq3">
                <AccordionTrigger className="text-foreground font-display text-sm md:text-base">
                  Could it break my headphones?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-xs md:text-sm space-y-2">
                  <p>We've seen some concerns raised by tech creators regarding the potential for headphone damage with certain stands. Here's what you need to know:</p>
                  <p><strong className="text-foreground">Safety Assurance:</strong> Our levitating headphone stands are specifically engineered with safety in mind. The internal design has been crafted to ensure compatibility with all headphone types.</p>
                  <p><strong className="text-foreground">Durability:</strong> Unlike other stands that might cause wear and tear over time, our stand is designed to prevent any damage to your headphones.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* You May Also Like */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground text-center mb-8">
              You May Also Like...
            </h2>
            <div className="grid grid-cols-2 gap-3 md:gap-6 max-w-2xl mx-auto">
              <a href="/products/floating-headphone-stand-leds" className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all">
                <div className="aspect-square overflow-hidden">
                  <img src={productLed} alt="LED Stand" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-xs md:text-sm font-display font-bold text-foreground leading-tight">Floating Headphone Stand - Coloured LED's</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm md:text-base font-bold text-foreground">$101.01</span>
                    <span className="text-xs text-muted-foreground line-through">$135.65</span>
                  </div>
                </div>
              </a>
              <a href="/products/floating-headphone-stand" className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all">
                <div className="aspect-square overflow-hidden">
                  <img src={productFront} alt="Standard Stand" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-xs md:text-sm font-display font-bold text-foreground leading-tight">Floating Headphone Stand</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm md:text-base font-bold text-foreground">$86.58</span>
                    <span className="text-xs text-muted-foreground line-through">$115.44</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky Bottom Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border p-3 md:hidden">
        <div className="flex items-center gap-3">
          <img src={allImages[selectedImage]} alt="" className="w-12 h-12 rounded-md bg-secondary object-contain p-1" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-bold text-foreground truncate">Floating Headphone Stand</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">$86.58</span>
              <span className="text-[10px] text-muted-foreground line-through">$115.44</span>
              <span className="text-[10px] font-bold text-primary">SAVE 25%</span>
            </div>
          </div>
          <button className="bg-primary text-primary-foreground font-display font-bold text-xs px-4 py-2.5 rounded-md whitespace-nowrap active:scale-95 transition-transform">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
