import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Futuristic gaming setup"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-48 flex flex-col items-center text-center">
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground mb-4 md:mb-6">
          Futuristic Gaming
          <br />
          <span className="text-primary text-glow">Setup Loading...</span>
        </h2>
        <Link
          to="/products/floating-headphone-stand"
          className="mt-4 inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground font-display font-semibold text-sm tracking-widest uppercase rounded-sm hover:box-glow-strong transition-shadow duration-300"
        >
          SHOP NOW
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
