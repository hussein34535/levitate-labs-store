import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center max-w-lg">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
          Subscribe to our emails
        </h2>
        <p className="text-muted-foreground mb-8">
          Join our email list for exclusive offers and the latest news.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-primary-foreground font-display font-bold text-sm tracking-widest uppercase rounded-md hover:box-glow-strong transition-shadow duration-300"
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
