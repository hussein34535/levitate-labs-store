import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProduct from "@/components/FeaturedProduct";
import CollectionsSection from "@/components/CollectionsSection";
import ElevateSection from "@/components/ElevateSection";
import NewsletterSection from "@/components/NewsletterSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProduct />
        <ElevateSection />
        <CollectionsSection />
        <NewsletterSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
