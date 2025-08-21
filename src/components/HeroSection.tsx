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
import heroImage from "@/assets/medical-hero.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [medicalAid, setMedicalAid] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('specialty', searchTerm);
    if (location) params.append('location', location);
    if (medicalAid) params.append('medical_aid', medicalAid);

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-subtle overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Medical professionals" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 animate-float">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <Shield className="h-8 w-8 text-white mb-2" />
          <p className="text-white text-sm font-medium">Secure Platform</p>
        </div>
      </div>

      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <Clock className="h-8 w-8 text-white mb-2" />
          <p className="text-white text-sm font-medium">24/7 Booking</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Badge */}
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Star className="h-3 w-3 mr-1" />
            South Africa's Premier Medical Booking Platform
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Medical Specialist
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Search by specialty, location, or medical aid. Book appointments instantly with top-rated doctors across South Africa.
          </p>

          {/* Search Box */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for specialists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 border-0 bg-background focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Enter your location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 border-0 bg-background focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Medical aid provider..."
                  value={medicalAid}
                  onChange={(e) => setMedicalAid(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 border-0 bg-background focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <Button size="lg" variant="hero" className="w-full h-12" onClick={handleSearch}>
              <Search className="h-5 w-5 mr-2" />
              Search Doctors
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
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
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Users className="h-5 w-5 mr-2" />
              Join as Doctor
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Calendar className="h-5 w-5 mr-2" />
              Emergency Booking
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
