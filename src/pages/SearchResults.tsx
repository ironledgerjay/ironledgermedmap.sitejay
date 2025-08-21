import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  MapPin,
  Shield,
  Clock,
  Star,
  Users,
  Calendar,
  Stethoscope,
  Heart,
  Filter,
  BookOpen,
  PhoneCall,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/superbaseClient";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  years_of_experience: number;
  consultation_fee: number;
  bio: string;
  phone: string;
  email: string;
  medical_practice: {
    name: string;
    address: string;
    city: string;
    province: string;
  };
  availability_hours: string;
  verified: boolean;
  license_number: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchData, setSearchData] = useState({
    specialty: searchParams.get("specialty") || "",
    location: searchParams.get("location") || "",
    medicalAid: searchParams.get("medical_aid") || "",
  });
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  // Sample doctors data for demonstration
  const sampleDoctors: Doctor[] = [
    {
      id: "1",
      full_name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      years_of_experience: 15,
      consultation_fee: 1200,
      bio: "Experienced cardiologist specializing in interventional cardiology and heart disease prevention.",
      phone: "+27 11 456-7890",
      email: "sarah.johnson@heartcare.co.za",
      medical_practice: {
        name: "Johannesburg Heart Institute",
        address: "123 Heart Street, Sandton",
        city: "Johannesburg",
        province: "Gauteng"
      },
      availability_hours: "Mon-Fri: 8AM-5PM",
      verified: true,
      license_number: "MP123456"
    },
    {
      id: "2",
      full_name: "Dr. Michael Chen",
      specialty: "General Practice",
      years_of_experience: 10,
      consultation_fee: 800,
      bio: "Family medicine practitioner with expertise in preventive care and chronic disease management.",
      phone: "+27 11 567-8901",
      email: "michael.chen@familycare.co.za",
      medical_practice: {
        name: "Johannesburg Family Clinic",
        address: "456 Family Avenue, Rosebank",
        city: "Johannesburg",
        province: "Gauteng"
      },
      availability_hours: "Mon-Sat: 7AM-7PM",
      verified: true,
      license_number: "MP234567"
    },
    {
      id: "3",
      full_name: "Dr. Amara Ndlovu",
      specialty: "Dermatology",
      years_of_experience: 12,
      consultation_fee: 950,
      bio: "Dermatologist specializing in skin cancer prevention and cosmetic dermatology.",
      phone: "+27 11 678-9012",
      email: "amara.ndlovu@skinclinic.co.za",
      medical_practice: {
        name: "Johannesburg Skin Clinic",
        address: "789 Skin Care Road, Melville",
        city: "Johannesburg",
        province: "Gauteng"
      },
      availability_hours: "Tue-Fri: 9AM-4PM",
      verified: true,
      license_number: "MP345678"
    }
  ];

  useEffect(() => {
    fetchDoctors();
  }, [searchParams]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('verified', true);

      if (error) {
        console.log('Using sample data:', error);
        setDoctors(sampleDoctors);
      } else if (data && data.length > 0) {
        setDoctors(data);
      } else {
        // Use sample data if no doctors in database
        setDoctors(sampleDoctors);
      }
    } catch (error) {
      console.log('Using sample data:', error);
      setDoctors(sampleDoctors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchData, sortBy]);

  const filterDoctors = () => {
    let filtered = doctors.filter(doctor => {
      const matchesSpecialty = !searchData.specialty || 
        doctor.specialty.toLowerCase().includes(searchData.specialty.toLowerCase());
      const matchesLocation = !searchData.location || 
        doctor.medical_practice.city.toLowerCase().includes(searchData.location.toLowerCase()) ||
        doctor.medical_practice.province.toLowerCase().includes(searchData.location.toLowerCase());
      
      return matchesSpecialty && matchesLocation;
    });

    // Sort results
    switch (sortBy) {
      case "experience":
        filtered.sort((a, b) => b.years_of_experience - a.years_of_experience);
        break;
      case "price_low":
        filtered.sort((a, b) => a.consultation_fee - b.consultation_fee);
        break;
      case "price_high":
        filtered.sort((a, b) => b.consultation_fee - a.consultation_fee);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredDoctors(filtered);
  };

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

  const handleBookAppointment = (doctor: Doctor) => {
    toast({
      title: "Booking Appointment",
      description: `Redirecting to book with ${doctor.full_name}...`,
    });
    navigate(`/book-appointment?doctor_id=${doctor.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Searching for doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      {/* Enhanced Hero Section with Animation */}
      <section className="relative bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/20 rounded-full animate-pulse delay-75"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/20 rounded-full animate-pulse delay-150"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center text-white">
          <div className="flex justify-center items-center mb-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-fade-in">
              <Shield className="h-4 w-4 mr-2" />
              South Africa's Premier Medical Booking Platform
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-in-from-top">
            Find Your Perfect Medical Specialist
          </h1>
          
          <p className="text-xl mb-8 text-white/90 animate-slide-in-from-bottom">
            Search by specialty, location, or medical aid. Book appointments instantly with top-rated doctors.
          </p>

          {/* Enhanced Search Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto border border-white/20 animate-fade-in-scale">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
                <Input
                  placeholder="Search specialists..."
                  value={searchData.specialty}
                  onChange={(e) => handleInputChange("specialty", e.target.value)}
                  className="pl-10 bg-white border-0 text-gray-900 placeholder-gray-500 hover:shadow-lg transition-shadow"
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
                <Input
                  placeholder="Enter location..."
                  value={searchData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="pl-10 bg-white border-0 text-gray-900 placeholder-gray-500 hover:shadow-lg transition-shadow"
                />
              </div>
              <div className="relative group">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
                <Input
                  placeholder="Medical aid..."
                  value={searchData.medicalAid}
                  onChange={(e) => handleInputChange("medicalAid", e.target.value)}
                  className="pl-10 bg-white border-0 text-gray-900 placeholder-gray-500 hover:shadow-lg transition-shadow"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white border-0 h-12 hover:scale-105 transition-transform"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Doctors
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filteredDoctors.length > 0 ? `${filteredDoctors.length} Doctors Found` : 'No Doctors Found'}
            </h2>
            {(searchData.specialty || searchData.location) && (
              <p className="text-gray-600">
                {searchData.specialty && `Specialty: ${searchData.specialty}`}
                {searchData.specialty && searchData.location && ' • '}
                {searchData.location && `Location: ${searchData.location}`}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results */}
        {filteredDoctors.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <Card 
                key={doctor.id} 
                className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up border-l-4 border-l-teal-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-16 w-16 ring-4 ring-teal-100">
                        <AvatarFallback className="bg-teal-500 text-white text-lg font-semibold">
                          {doctor.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{doctor.full_name}</CardTitle>
                          {doctor.verified && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <Badge variant="secondary" className="bg-teal-100 text-teal-800 mb-2">
                          <Stethoscope className="h-3 w-3 mr-1" />
                          {doctor.specialty}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{doctor.years_of_experience} years experience</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Consultation</p>
                      <p className="text-2xl font-bold text-teal-600">R{doctor.consultation_fee}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">{doctor.bio}</p>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.medical_practice.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{doctor.availability_hours}</span>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <Button 
                        onClick={() => handleBookAppointment(doctor)}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 hover:scale-105 transition-transform"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.open(`tel:${doctor.phone}`, '_self')}
                        className="border-teal-300 text-teal-600 hover:bg-teal-50"
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 animate-fade-in">
            <CardContent>
              <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Doctors Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all available doctors.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchData({ specialty: "", location: "", medicalAid: "" });
                    navigate('/search');
                  }}
                >
                  Clear Search
                </Button>
                <Button onClick={() => navigate('/emergency-doctors')}>
                  Emergency Doctors
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        {filteredDoctors.length > 0 && (
          <div className="mt-12 text-center bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">Ready to Book Your Appointment?</h3>
            <p className="text-teal-100 mb-6">Join thousands of satisfied patients who found their perfect healthcare match</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        )}
      </div>
    </div>
  );
};

export default SearchResults;
