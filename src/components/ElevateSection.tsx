import setup1 from "@/assets/setup-1.png";
import setup2 from "@/assets/setup-2.png";
import ImageComparisonSlider from "./ImageComparisonSlider";

const ElevateSection = () => {
  return (
    <section className="py-10 md:py-24 bg-card">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-2 md:mb-3">
          Elevate your set up
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-8 md:mb-12">
          Available in black or white. Drag to compare — built to complement any desk aesthetic
        </p>
        <ImageComparisonSlider
          beforeImage={setup1}
          afterImage={setup2}
          beforeLabel="Dark Edition"
          afterLabel="Light Edition"
        />
      </div>
    </section>
  );
};

export default ElevateSection;
