import productStandard from "@/assets/product-standard.png";
import productBlack from "@/assets/product-black.png";
import productSide from "@/assets/product-side.png";
import { ArrowRight } from "lucide-react";

const collections = [
  { title: "Home page", image: productStandard },
  { title: "Our Floating Headphone Stands", image: productBlack },
  { title: "You may also like...", image: productSide },
];

const CollectionsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12">
          Collections
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <a
              key={col.title}
              href="#products"
              className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all"
            >
              <div className="aspect-square flex items-center justify-center p-8 bg-secondary/30">
                <img
                  src={col.image}
                  alt={col.title}
                  className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex items-center justify-center gap-2 text-foreground font-display font-semibold">
                {col.title}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-primary" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
