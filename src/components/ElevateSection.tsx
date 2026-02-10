import setup1 from "@/assets/setup-1.png";
import setup2 from "@/assets/setup-2.png";

const ElevateSection = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
          Elevate your set up
        </h2>
        <p className="text-muted-foreground mb-12">
          Available in black or white. Built to complement any desk aesthetic
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors">
            <img src={setup1} alt="Black setup" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors">
            <img src={setup2} alt="White setup" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElevateSection;
