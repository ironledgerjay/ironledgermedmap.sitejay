import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Shield,
  Clock,
  Star,
  Users,
  Calendar
} from "lucide-react";
import Header from "@/components/Header";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import MembershipSection from "@/components/MembershipSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchData, setSearchData] = useState({
    specialty: "",
    location: "",
    medicalAid: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.specialty) params.set("specialty", searchData.specialty);
    if (searchData.location) params.set("location", searchData.location);
    if (searchData.medicalAid) params.set("medical_aid", searchData.medicalAid);

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Original Design */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Shield className="h-4 w-4 mr-2" />
            South Africa's Premier Medical Booking Platform
          </Badge>
        </div>
        <div className="absolute top-4 right-20">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Shield className="h-4 w-4 mr-2" />
            Secure Platform
          </Badge>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="text-teal-100">Medical Specialist</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-4xl mx-auto">
            Search by specialty, location, or medical aid. Book appointments instantly with top-rated doctors across South Africa.
          </p>

          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12 max-w-4xl mx-auto border border-white/20">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for specialists..."
                  value={searchData.specialty}
                  onChange={(e) => handleInputChange("specialty", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-white border-0 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Enter your location..."
                  value={searchData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-white border-0 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Medical aid provider..."
                  value={searchData.medicalAid}
                  onChange={(e) => handleInputChange("medicalAid", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-white border-0 text-gray-900 placeholder-gray-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white border-0 h-12"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Doctors
              </Button>
            </div>
          </div>

          {/* 24/7 Booking Badge */}
          <div className="flex justify-center mb-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              24/7 Booking
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-white/80">Verified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">50+</div>
              <div className="text-white/80">Specialties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">9+</div>
              <div className="text-white/80">Provinces</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-white/80">Support</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate('/doctor-enrollment')}
            >
              <Users className="h-5 w-5 mr-2" />
              Join as Doctor
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate('/emergency-doctors')}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Emergency Booking
            </Button>
          </div>
        </div>
      </section>

      <SpecialtiesSection />
      <MembershipSection />
      <Footer />
    </div>
  );
};

export default Index;
