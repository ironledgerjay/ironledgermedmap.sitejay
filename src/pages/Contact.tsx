import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import HomeButton from "@/components/HomeButton";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <HomeButton />
      <Header />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Contact;
