import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Mail,
  Filter,
  ChevronLeft,
  Heart,
  Calendar,
  DollarSign
} from "lucide-react";

// Mock data for testing - will be replaced with Supabase data
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    location: "Cape Town, Western Cape",
    experience: 15,
    rating: 4.8,
    reviews: 127,
    image: "/placeholder.svg",
    qualification: "MBChB, FCP(SA), PhD",
    medicalAids: ["Discovery", "Momentum", "Bonitas"],
    consultationFee: 850,
    phone: "+27 21 123 4567",
    email: "sarah.johnson@heartcare.co.za",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
    bio: "Specialist in cardiovascular diseases with over 15 years of experience in interventional cardiology."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    location: "Johannesburg, Gauteng",
    experience: 12,
    rating: 4.9,
    reviews: 203,
    image: "/placeholder.svg",
    qualification: "MBChB, FC Derm(SA)",
    medicalAids: ["Discovery", "Medscheme", "GEMS"],
    consultationFee: 750,
    phone: "+27 11 987 6543",
    email: "m.chen@skincare.co.za",
    availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
    bio: "Expert in medical and cosmetic dermatology, specializing in skin cancer treatment and prevention."
  },
  {
    id: 3,
    name: "Dr. Priya Patel",
    specialty: "Pediatrician",
    location: "Durban, KwaZulu-Natal",
    experience: 8,
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg",
    qualification: "MBChB, DCH, FC Paed(SA)",
    medicalAids: ["Discovery", "Momentum", "Bonitas", "Fedhealth"],
    consultationFee: 650,
    phone: "+27 31 555 7890",
    email: "priya.patel@kidsdoc.co.za",
    availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday"],
    bio: "Dedicated pediatrician with special interest in child development and adolescent medicine."
  },
  {
    id: 4,
    name: "Dr. James Williams",
    specialty: "Orthopedic Surgeon",
    location: "Pretoria, Gauteng",
    experience: 20,
    rating: 4.6,
    reviews: 156,
    image: "/placeholder.svg",
    qualification: "MBChB, FC Orth(SA), MMed",
    medicalAids: ["Discovery", "Momentum", "GEMS"],
    consultationFee: 950,
    phone: "+27 12 321 0987",
    email: "james.williams@orthosurg.co.za",
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    bio: "Leading orthopedic surgeon specializing in joint replacement and sports injury treatment."
  },
  {
    id: 5,
    name: "Dr. Fatima Al-Rashid",
    specialty: "Gynecologist",
    location: "Cape Town, Western Cape",
    experience: 14,
    rating: 4.9,
    reviews: 234,
    image: "/placeholder.svg",
    qualification: "MBChB, FCOG(SA), MMed",
    medicalAids: ["Discovery", "Bonitas", "Fedhealth", "Momentum"],
    consultationFee: 800,
    phone: "+27 21 654 3210",
    email: "fatima.alrashid@womenshealth.co.za",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    bio: "Experienced gynecologist and obstetrician with expertise in high-risk pregnancies and minimally invasive surgery."
  }
];

const specialties = [
  "All Specialties", "Cardiologist", "Dermatologist", "Pediatrician", 
  "Orthopedic Surgeon", "Gynecologist", "Neurologist", "Psychiatrist",
  "General Practitioner", "Ophthalmologist", "ENT Specialist"
];

const provinces = [
  "All Provinces", "Western Cape", "Gauteng", "KwaZulu-Natal", 
  "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", 
  "North West", "Northern Cape"
];

const medicalAids = [
  "All Medical Aids", "Discovery", "Momentum", "Bonitas", 
  "GEMS", "Fedhealth", "Medscheme", "Bestmed"
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('specialty') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [selectedMedicalAid, setSelectedMedicalAid] = useState('All Medical Aids');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, location, selectedSpecialty, selectedProvince, selectedMedicalAid, priceRange, sortBy]);

  const filterDoctors = () => {
    let filtered = mockDoctors.filter(doctor => {
      const matchesSearch = searchTerm === '' || 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = location === '' || 
        doctor.location.toLowerCase().includes(location.toLowerCase());
      
      const matchesSpecialty = selectedSpecialty === 'All Specialties' || 
        doctor.specialty === selectedSpecialty;
      
      const matchesProvince = selectedProvince === 'All Provinces' || 
        doctor.location.includes(selectedProvince);
      
      const matchesMedicalAid = selectedMedicalAid === 'All Medical Aids' || 
        doctor.medicalAids.includes(selectedMedicalAid);
      
      const matchesPrice = doctor.consultationFee >= priceRange[0] && 
        doctor.consultationFee <= priceRange[1];
      
      return matchesSearch && matchesLocation && matchesSpecialty && 
             matchesProvince && matchesMedicalAid && matchesPrice;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.consultationFee - b.consultationFee;
        case 'price-high':
          return b.consultationFee - a.consultationFee;
        case 'experience':
          return b.experience - a.experience;
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <span>Search Results</span>
        </div>

        {/* Search Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h1 className="text-2xl font-bold mb-4">Find Your Doctor</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search doctors or specialties..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Location..." 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="h-12">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Specialty</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Province</label>
                  <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Medical Aid</label>
                  <Select value={selectedMedicalAid} onValueChange={setSelectedMedicalAid}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {medicalAids.map(aid => (
                        <SelectItem key={aid} value={aid}>
                          {aid}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Consultation Fee: R{priceRange[0]} - R{priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    min={0}
                    step={50}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {filteredDoctors.length} doctors found
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Cards */}
            <div className="space-y-6">
              {filteredDoctors.map(doctor => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Doctor Image */}
                      <div className="md:col-span-1">
                        <img 
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-full h-48 md:h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Doctor Info */}
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold">{doctor.name}</h3>
                          <p className="text-primary font-medium">{doctor.specialty}</p>
                          <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            {doctor.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            {doctor.experience} years exp.
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-medium">{doctor.rating}</span>
                            <span className="text-sm text-muted-foreground ml-1">
                              ({doctor.reviews} reviews)
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {doctor.bio}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {doctor.medicalAids.slice(0, 3).map(aid => (
                            <Badge key={aid} variant="secondary" className="text-xs">
                              {aid}
                            </Badge>
                          ))}
                          {doctor.medicalAids.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{doctor.medicalAids.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-1 space-y-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            R{doctor.consultationFee}
                          </div>
                          <p className="text-sm text-muted-foreground">consultation</p>
                        </div>

                        <div className="space-y-2">
                          <Link to={`/book-appointment?doctor=${doctor.id}`}>
                            <Button className="w-full">
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Appointment
                            </Button>
                          </Link>
                          <Button variant="outline" className="w-full">
                            <Heart className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                            {doctor.phone}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                            {doctor.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
