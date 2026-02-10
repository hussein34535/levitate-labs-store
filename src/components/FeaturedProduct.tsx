import { useState } from "react";
import productBlack from "@/assets/product-black.png";
import productWhite from "@/assets/product-white.png";
import productAngle from "@/assets/product-angle.png";
import productSide from "@/assets/product-side.png";
import productFront from "@/assets/product-front.png";
import heroBg from "@/assets/hero-bg.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const colorVariants = [
  { name: "Black", image: productBlack },
  { name: "White", image: productWhite },
];

const allImages = [productBlack, productAngle, productSide, productFront, productWhite, heroBg];

const plugTypes = ["US standard", "European standard", "Australian standard", "British standard"];

const FeaturedProduct = () => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedPlug, setSelectedPlug] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section id="products" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg overflow-hidden aspect-square flex items-center justify-center border border-border">
              <img
                src={allImages[selectedImage]}
                alt="Floating Headphone Stand"
                className="w-full h-full object-contain p-8 animate-float"
              />
            </div>
            <div className="grid grid-cols-6 gap-2">
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
                  <img src={img} alt="" className="w-full h-full object-contain bg-card p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Floating Headphone Stand - Coloured LED's
            </h2>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-display font-bold text-foreground">$100.97</span>
              <span className="text-lg text-muted-foreground line-through">$135.59</span>
              <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                🏷 SAVE 25%
              </span>
            </div>

            {/* Color Selector */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Colours</p>
              <div className="flex gap-3">
                {colorVariants.map((variant, i) => (
                  <button
                    key={variant.name}
                    onClick={() => {
                      setSelectedColor(i);
                      setSelectedImage(i === 0 ? 0 : 4);
                    }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedColor === i
                        ? "border-primary box-glow"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img src={variant.image} alt={variant.name} className="w-full h-full object-contain bg-card p-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Plug Type */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Plug Type</p>
              <div className="grid grid-cols-2 gap-2">
                {plugTypes.map((plug, i) => (
                  <button
                    key={plug}
                    onClick={() => setSelectedPlug(i)}
                    className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
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
            <button className="w-full py-4 bg-primary text-primary-foreground font-display font-bold text-sm tracking-widest uppercase rounded-md hover:box-glow-strong transition-shadow duration-300">
              Add to Cart
            </button>

            <a href="#" className="block text-center text-sm text-primary hover:underline">
              View full details →
            </a>

            {/* Specs Accordion */}
            <Accordion type="multiple" className="border-t border-border">
              <AccordionItem value="specs">
                <AccordionTrigger className="text-foreground font-display">
                  ✨ Specifications
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2 text-sm">
                  <p><strong className="text-foreground">Stand Dimensions:</strong> 17.3" L x 9.37" W x 2.83" H</p>
                  <p><strong className="text-foreground">Power Input:</strong> Standard 12V | 100-220V AC</p>
                  <p><strong className="text-foreground">Weight Capacity:</strong> 200-600 grams - 1.2 lbs</p>
                  <p><strong className="text-foreground">Materials:</strong> Acrylic/Plexiglass, Plastic</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="included">
                <AccordionTrigger className="text-foreground font-display">
                  ❓ What's Included
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-1 text-sm">
                  <p>1 x Levitate Labs headphone stand</p>
                  <p>1 x Magnet</p>
                  <p>1 x Power cable</p>
                  <p>1 x User guide</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-foreground font-display">
                  🚚 Shipping Information
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2 text-sm">
                  <p>📦 <strong className="text-foreground">Processing Time:</strong> 1-3 business days</p>
                  <p>✈️ <strong className="text-foreground">Shipping Time:</strong> 7-14 business days worldwide with tracking</p>
                  <p>We ensure every stand passes quality checks and is securely packaged.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
