import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, PackageSearch } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <PackageSearch className="h-7 w-7 text-primary" />
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-3">
            Error 404
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Lost in orbit
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="font-mono text-xs text-muted-foreground/60 mb-8 break-all">
            {location.pathname}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="w-full sm:w-auto gap-2">
              <Link to="/">
                <Home size={16} /> Back to Store
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
              <Link to="/track">
                <PackageSearch size={16} /> Track an Order
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
