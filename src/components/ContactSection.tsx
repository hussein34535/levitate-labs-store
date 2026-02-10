import { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", comment: "" });

  return (
    <section id="contact" className="py-10 md:py-24 bg-card">
      <div className="container mx-auto px-4 max-w-xl">
        <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground text-center mb-8 md:mb-10">
          Contact form
        </h2>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {[
            { key: "name", label: "Name", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Phone number", type: "tel" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Comment</label>
            <textarea
              rows={4}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-primary-foreground font-display font-bold text-sm tracking-widest uppercase rounded-md hover:box-glow-strong transition-shadow duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
