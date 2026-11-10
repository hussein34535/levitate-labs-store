import { useState } from "react";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    toast.success("Thank you for subscribing to ORBITA updates!");
    setEmail("");
    setSubmitting(false);
  };

  return (
    <section className="py-10 md:py-24">
      <div className="container mx-auto px-4 text-center max-w-lg">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-2 md:mb-3">
          Subscribe to our emails
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
          Join our email list for exclusive offers and the latest news.
        </p>
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-primary text-primary-foreground font-display font-bold text-sm tracking-widest uppercase rounded-md hover:bg-primary/90 transition-colors shrink-0 active:scale-[0.98] disabled:opacity-50"
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
