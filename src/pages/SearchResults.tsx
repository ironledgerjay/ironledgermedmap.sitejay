import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  MapPin, 
  Shield, 
  Star, 
  Calendar, 
  DollarSign,
  User,
  Phone,
  Mail,
  Filter,
  Clock,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "../superbaseClient";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  specialty: string;
  years_of_experience: number;
  consultation_fee: number;
  bio: string;
  rating?: number;
  verification_status?: string;
  user_profiles: {
    full_name: string;
    email: string;
    phone: string;
  };
  medical_practices: {
    id: string;
    name: string;
    address: string;
    city: string;
    province: string;
    medical_aid_providers?: string[];
  };
}

// Sample data for fallback when database is not populated
const getSampleDoctors = (): Doctor[] => [
  {
    id: 'sample-1',
    specialty: 'Cardiology',
    years_of_experience: 15,
    consultation_fee: 1200,
    bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
    rating: 4.8,
    verification_status: 'verified',
    user_profiles: {
      full_name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@ironledgermedmap.com',
      phone: '021 123 4567'
    },
    medical_practices: {
      id: 'practice-1',
      name: 'Cape Heart Centre',
      address: '123 Medical Street, Green Point',
      city: 'Cape Town',
      province: 'Western Cape',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Bonitas']
    }
  },
  {
    id: 'sample-2',
    specialty: 'Family Medicine',
    years_of_experience: 8,
    consultation_fee: 800,
    bio: 'Family medicine practitioner focused on comprehensive primary care.',
    rating: 4.6,
    verification_status: 'verified',
    user_profiles: {
      full_name: 'Dr. Michael Chen',
      email: 'michael.chen@ironledgermedmap.com',
      phone: '021 987 6543'
    },
    medical_practices: {
      id: 'practice-2',
      name: 'Family Care Medical Centre',
      address: '456 Health Avenue, Stellenbosch',
      city: 'Stellenbosch',
      province: 'Western Cape',
      medical_aid_providers: ['Discovery Health', 'Medihelp', 'Fedhealth']
    }
  },
  {
    id: 'sample-3',
    specialty: 'Neurology',
    years_of_experience: 12,
    consultation_fee: 1100,
    bio: 'Neurologist specializing in brain and nervous system disorders.',
    rating: 4.7,
    verification_status: 'verified',
    user_profiles: {
      full_name: 'Dr. Amina Patel',
      email: 'amina.patel@ironledgermedmap.com',
      phone: '011 234 5678'
    },
    medical_practices: {
      id: 'practice-3',
      name: 'Johannesburg Neurology Centre',
      address: '789 Medical Plaza, Sandton',
      city: 'Johannesburg',
      province: 'Gauteng',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Gems']
    }
  },
  {
    id: 'sample-4',
    specialty: 'Pediatrics',
    years_of_experience: 10,
    consultation_fee: 900,
    bio: 'Pediatrician dedicated to children\'s health and development.',
    rating: 4.9,
    verification_status: 'verified',
    user_profiles: {
      full_name: 'Dr. James Mthembu',
      email: 'james.mthembu@ironledgermedmap.com',
      phone: '012 345 6789'
    },
    medical_practices: {
      id: 'practice-4',
      name: 'Little Angels Pediatric Clinic',
      address: '321 Children\'s Way, Pretoria',
      city: 'Pretoria',
      province: 'Gauteng',
      medical_aid_providers: ['Discovery Health', 'Bonitas', 'Medihelp']
    }
  },
  {
    id: 'sample-5',
    specialty: 'Orthopedic Surgery',
    years_of_experience: 18,
    consultation_fee: 1300,
    bio: 'Orthopedic surgeon specializing in joint replacement and sports injuries.',
    rating: 4.8,
    verification_status: 'verified',
    user_profiles: {
      full_name: 'Dr. Robert Singh',
      email: 'robert.singh@ironledgermedmap.com',
      phone: '031 456 7890'
    },
    medical_practices: {
      id: 'practice-5',
      name: 'Durban Orthopedic Institute',
      address: '654 Sports Medicine Road, Umhlanga',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      medical_aid_providers: ['Discovery Health', 'Momentum Health', 'Fedhealth']
    }
  },
  {
    id: 'sample-6',
    specialty: 'Dermatology',
    years_of_experience: 11,
    consultation_fee: 850,
    bio: 'Dermatologist specializing in skin health and cosmetic procedures.',
    rating: 4.5,
    verification_status: 'verified',
    user_profiles: {
      full_name: 'Dr. Michelle van der Merwe',
      email: 'michelle.vandermerwe@ironledgermedmap.com',
      phone: '043 789 0123'
    },
    medical_practices: {
      id: 'practice-6',
      name: 'East London Dermatology Clinic',
      address: '258 Skin Care Street, Vincent',
      city: 'East London',
      province: 'Eastern Cape',
      medical_aid_providers: ['Discovery Health', 'Medihelp', 'Fedhealth']
    }
  }
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: searchParams.get('specialty') || '',
    location: searchParams.get('location') || '',
    medicalAid: searchParams.get('medicalAid') || '',
    minFee: '',
    maxFee: '',
    sortBy: 'rating'
  });
  
  const { toast } = useToast();

  useEffect(() => {
    searchDoctors();
  }, [searchParams]);

  // Real-time search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.specialty || filters.location || filters.medicalAid || filters.minFee || filters.maxFee) {
        searchDoctors();
      }
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [filters.specialty, filters.location, filters.medicalAid, filters.minFee, filters.maxFee]);

  const searchDoctors = async () => {
    setLoading(true);
    try {
      console.log('Starting search with filters:', filters);

      // First, try a simple query to check if the doctors table exists
      let query = supabase
        .from('doctors')
        .select('*')
        .eq('verification_status', 'verified');

      // Apply filters
      if (filters.specialty && filters.specialty !== 'all') {
        console.log('Applying specialty filter:', filters.specialty);
        query = query.ilike('specialty', `%${filters.specialty}%`);
      }

      if (filters.minFee && !isNaN(Number(filters.minFee))) {
        console.log('Applying min fee filter:', filters.minFee);
        query = query.gte('consultation_fee', Number(filters.minFee));
      }

      if (filters.maxFee && !isNaN(Number(filters.maxFee))) {
        console.log('Applying max fee filter:', filters.maxFee);
        query = query.lte('consultation_fee', Number(filters.maxFee));
      }

      console.log('Executing query...');
      const { data, error } = await query;
      console.log('Query result:', { data: data?.length, error });

      if (error) {
        console.error('Supabase search error:', error);
        console.error('Supabase error details:', JSON.stringify(error, null, 2));

        // If there's a database error, fall back to sample data for demo
        console.log('Database query failed, using sample data for demonstration');
        setDoctors(getSampleDoctors());

        toast({
          title: "Using Sample Data",
          description: "Connected to demo database. Some features may be limited.",
          variant: "default"
        });
      } else {
        let results = data || [];
        console.log('Raw results from database:', results.length, results[0]);

        // If no data from database, use sample data
        if (results.length === 0) {
          console.log('No data in database, using sample data');
          results = getSampleDoctors();

          toast({
            title: "Demo Mode",
            description: "Showing sample data. Database may not be populated yet.",
            variant: "default"
          });
        }

        // Client-side filtering for location
        if (filters.location && filters.location !== 'all') {
          const locationFilter = filters.location.toLowerCase();
          results = results.filter(doctor => {
            const practices = doctor.medical_practices;
            if (!practices) return false;
            return practices.city?.toLowerCase().includes(locationFilter) ||
                   practices.province?.toLowerCase().includes(locationFilter) ||
                   practices.address?.toLowerCase().includes(locationFilter);
          });
        }

        // Client-side filtering for medical aid
        if (filters.medicalAid && filters.medicalAid !== 'all') {
          results = results.filter(doctor => {
            const practices = doctor.medical_practices;
            if (!practices?.medical_aid_providers) return false;
            return practices.medical_aid_providers.some(provider =>
              provider.toLowerCase().includes(filters.medicalAid.toLowerCase())
            );
          });
        }

        // Sort results with safety checks
        results.sort((a, b) => {
          switch (filters.sortBy) {
            case 'fee_low':
              return (a.consultation_fee || 0) - (b.consultation_fee || 0);
            case 'fee_high':
              return (b.consultation_fee || 0) - (a.consultation_fee || 0);
            case 'experience':
              return (b.years_of_experience || 0) - (a.years_of_experience || 0);
            case 'rating':
            default:
              return (b.rating || 4.5) - (a.rating || 4.5);
          }
        });

        console.log('Final filtered results:', results.length);
        setDoctors(results);
      }
    } catch (error) {
      console.error('Caught search error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));

      // Provide fallback sample data for demonstration
      console.log('Using fallback sample data due to error');
      setDoctors(getSampleDoctors());

      toast({
        title: "Demo Mode Active",
        description: "Showing sample data. Please check database connection.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(field, value);
    } else {
      newParams.delete(field);
    }
    setSearchParams(newParams);
  };

  const handleSearch = () => {
    searchDoctors();
  };

  const specialties = [
    'Cardiology', 'Dermatology', 'Emergency Medicine', 'Family Medicine', 
    'Internal Medicine', 'Neurology', 'Obstetrics & Gynecology', 'Oncology',
    'Orthopedic Surgery', 'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery'
  ];

  const provinces = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
    'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
  ];

  const medicalAidProviders = [
    'Discovery Health', 'Momentum Health', 'Bonitas', 'Medihelp', 'Fedhealth',
    'Gems', 'Polmed', 'Bankmed', 'Compcare', 'Selfmed'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <div className="bg-gradient-subtle py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6">Find Your Doctor</h1>
            
            {/* Search Filters */}
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search specialists..."
                    value={filters.specialty}
                    onChange={(e) => handleFilterChange('specialty', e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Location (city or province)"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Medical aid provider"
                    value={filters.medicalAid}
                    onChange={(e) => handleFilterChange('medicalAid', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Select value={filters.specialty || 'all'} onValueChange={(value) => handleFilterChange('specialty', value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filters.location || 'all'} onValueChange={(value) => handleFilterChange('location', value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    {provinces.map(province => (
                      <SelectItem key={province} value={province}>{province}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="fee_low">Lowest Fee</SelectItem>
                    <SelectItem value="fee_high">Highest Fee</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Min fee (R)"
                    value={filters.minFee}
                    onChange={(e) => handleFilterChange('minFee', e.target.value)}
                    type="number"
                    className="flex-1"
                  />
                  <Input
                    placeholder="Max fee (R)"
                    value={filters.maxFee}
                    onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                    type="number"
                    className="flex-1"
                  />
                </div>
                
                <Select value={filters.medicalAid || 'all'} onValueChange={(value) => handleFilterChange('medicalAid', value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medical aid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Medical Aids</SelectItem>
                    {medicalAidProviders.map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              {loading ? 'Searching...' : `${doctors.length} doctors found`}
            </h2>
            {!loading && doctors.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Sorted by {filters.sortBy.replace('_', ' ')}</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex space-x-4">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse all available doctors.
              </p>
              <Button onClick={() => {
                setFilters({ specialty: '', location: '', medicalAid: '', minFee: '', maxFee: '', sortBy: 'rating' });
                setSearchParams({});
                searchDoctors();
              }}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full flex-shrink-0">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {doctor.user_profiles?.full_name || 'Dr. Name'}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{doctor.specialty}</Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{doctor.rating || 4.5}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span>{doctor.years_of_experience} years</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>R{doctor.consultation_fee}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {doctor.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {doctor.bio}
                      </p>
                    )}
                    
                    {doctor.medical_practices && (
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium">{doctor.medical_practices.name}</p>
                            <p className="text-muted-foreground">
                              {doctor.medical_practices.address}, {doctor.medical_practices.city}, {doctor.medical_practices.province}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doctor.user_profiles?.phone || 'Contact via platform'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doctor.user_profiles?.email || 'Contact via platform'}</span>
                        </div>
                      </div>
                    )}
                    
                    {doctor.medical_practices?.medical_aid_providers && doctor.medical_practices.medical_aid_providers.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Accepted Medical Aid:</p>
                        <div className="flex flex-wrap gap-1">
                          {doctor.medical_practices.medical_aid_providers.slice(0, 3).map((provider, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {provider}
                            </Badge>
                          ))}
                          {doctor.medical_practices.medical_aid_providers.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{doctor.medical_practices.medical_aid_providers.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-4">
                      <Link to={`/book-appointment?doctor=${doctor.id}`} className="flex-1">
                        <Button className="w-full">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
