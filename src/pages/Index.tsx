import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  MapPin,
  Shield,
  Clock,
  Star,
  Users,
  Calendar,
  Sparkles,
  TrendingUp,
  HeartHandshake,
  Zap,
  ArrowRight,
  Phone,
  MessageCircle
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Enhanced Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-20 right-20 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        <div className="absolute top-1/2 left-20 animate-pulse-soft">
          <Sparkles className="h-6 w-6 text-white/30" />
        </div>

        {/* Dynamic Status Badges */}
        <div className="absolute top-6 right-6 space-y-3 animate-slide-in-from-top">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
            <Shield className="h-4 w-4 mr-2" />
            South Africa's Premier Medical Platform
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
            <TrendingUp className="h-4 w-4 mr-2" />
            {animationPhase === 0 && "500+ Verified Doctors"}
            {animationPhase === 1 && "24/7 Booking Available"}
            {animationPhase === 2 && "Trusted by 10,000+ Patients"}
          </Badge>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <br />
              <span className="text-teal-100 relative">
                Medical Specialist
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-white/30 rounded-full animate-slide-in-from-bottom"></div>
              </span>
            </h1>
          </div>

          <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-4xl mx-auto">
              Search by specialty, location, or medical aid. Book appointments instantly with top-rated doctors across South Africa.
            </p>
          </div>

          {/* Enhanced Interactive Search Form */}
          <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12 max-w-4xl mx-auto border transition-all duration-500 animate-fade-in-scale ${
            isSearchFocused ? 'border-white/40 shadow-2xl bg-white/15' : 'border-white/20'
          }`} style={{animationDelay: '0.4s'}}>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                <Input
                  placeholder="Search for specialists..."
                  value={searchData.specialty}
                  onChange={(e) => handleInputChange("specialty", e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 bg-white border-0 text-gray-900 placeholder-gray-500 transition-all duration-300 hover:shadow-lg focus:shadow-xl focus:ring-2 focus:ring-white/30"
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                <Input
                  placeholder="Enter your location..."
                  value={searchData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 bg-white border-0 text-gray-900 placeholder-gray-500 transition-all duration-300 hover:shadow-lg focus:shadow-xl focus:ring-2 focus:ring-white/30"
                />
              </div>
              <div className="relative group">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                <Input
                  placeholder="Medical aid provider..."
                  value={searchData.medicalAid}
                  onChange={(e) => handleInputChange("medicalAid", e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 bg-white border-0 text-gray-900 placeholder-gray-500 transition-all duration-300 hover:shadow-lg focus:shadow-xl focus:ring-2 focus:ring-white/30"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white border-0 h-12 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <Search className="h-5 w-5 mr-2 relative z-10" />
                <span className="relative z-10">Search Doctors</span>
              </Button>
            </div>

            {/* Quick Search Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center animate-fade-in" style={{animationDelay: '0.6s'}}>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer transition-all duration-300"
                onClick={() => setSearchData(prev => ({...prev, specialty: 'Cardiology'}))}
              >
                <HeartHandshake className="h-3 w-3 mr-1" />
                Cardiology
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer transition-all duration-300"
                onClick={() => setSearchData(prev => ({...prev, specialty: 'General Practice'}))}
              >
                <Users className="h-3 w-3 mr-1" />
                General Practice
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer transition-all duration-300"
                onClick={() => setSearchData(prev => ({...prev, location: 'Cape Town'}))}
              >
                <MapPin className="h-3 w-3 mr-1" />
                Cape Town
              </Badge>
            </div>
          </div>

          {/* Enhanced Status Badges */}
          <div className="flex justify-center mb-8 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 hover:bg-white/30 transition-all duration-300">
                <Clock className="h-4 w-4 mr-2" />
                24/7 Booking
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 hover:bg-white/30 transition-all duration-300">
                <Zap className="h-4 w-4 mr-2" />
                Instant Confirmation
              </Badge>
            </div>
          </div>

          {/* Enhanced Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center p-4 hover:bg-white/15 transition-all duration-300 animate-fade-in-scale" style={{animationDelay: '1s'}}>
              <CardContent className="p-0">
                <div className="text-3xl font-bold mb-1 text-white">500+</div>
                <div className="text-white/80 text-sm">Verified Doctors</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center p-4 hover:bg-white/15 transition-all duration-300 animate-fade-in-scale" style={{animationDelay: '1.2s'}}>
              <CardContent className="p-0">
                <div className="text-3xl font-bold mb-1 text-white">50+</div>
                <div className="text-white/80 text-sm">Specialties</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center p-4 hover:bg-white/15 transition-all duration-300 animate-fade-in-scale" style={{animationDelay: '1.4s'}}>
              <CardContent className="p-0">
                <div className="text-3xl font-bold mb-1 text-white">9+</div>
                <div className="text-white/80 text-sm">Provinces</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center p-4 hover:bg-white/15 transition-all duration-300 animate-fade-in-scale" style={{animationDelay: '1.6s'}}>
              <CardContent className="p-0">
                <div className="text-3xl font-bold mb-1 text-white">24/7</div>
                <div className="text-white/80 text-sm">Support</div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up" style={{animationDelay: '1.8s'}}>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              onClick={() => navigate('/doctor-enrollment')}
            >
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Users className="h-5 w-5 mr-2 relative z-10" />
              <span className="relative z-10">Join as Doctor</span>
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              onClick={() => navigate('/emergency-doctors')}
            >
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Calendar className="h-5 w-5 mr-2 relative z-10" />
              <span className="relative z-10">Emergency Booking</span>
              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 animate-fade-in" style={{animationDelay: '2s'}}>
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-110 group"
          onClick={() => navigate('/emergency-doctors')}
        >
          <Phone className="h-6 w-6 group-hover:animate-pulse" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-14 h-14 bg-white/90 backdrop-blur border-primary/20 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-110 group"
          onClick={() => navigate('/contact')}
        >
          <MessageCircle className="h-6 w-6 text-primary group-hover:animate-pulse" />
        </Button>
      </div>

      <SpecialtiesSection />
      <MembershipSection />
      <Footer />
    </div>
  );
};

export default Index;
