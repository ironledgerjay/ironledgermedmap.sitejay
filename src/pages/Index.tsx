import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import MembershipSection from "@/components/MembershipSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SpecialtiesSection />
      <MembershipSection />
      <Footer />
    </div>
  );
};

export default Index;
