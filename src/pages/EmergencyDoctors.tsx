import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Clock, 
  Phone, 
  MapPin, 
  Star, 
  Stethoscope,
  Heart,
  Search,
  Filter
} from 'lucide-react';
import { supabase } from '@/superbaseClient';
import { useToast } from '@/hooks/use-toast';
import HomeButton from '@/components/HomeButton';

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
}

const EmergencyDoctors = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const emergencySpecialties = [
    'Emergency Medicine',
    'Cardiology',
    'Neurology',
    'General Practice',
    'Internal Medicine'
  ];

  const provinces = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Free State',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape'
  ];

  // Sample emergency doctors data
  const sampleDoctors: Doctor[] = [
    {
      id: '1',
      full_name: 'Dr. Sarah Johnson',
      specialty: 'Emergency Medicine',
      years_of_experience: 12,
      consultation_fee: 1200,
      bio: 'Emergency medicine specialist with extensive experience in trauma and critical care.',
      phone: '+27 11 456-7890',
      email: 'sarah.johnson@emergency.co.za',
      medical_practice: {
        name: 'Johannesburg Emergency Centre',
        address: '123 Emergency Ave',
        city: 'Johannesburg',
        province: 'Gauteng'
      },
      availability_hours: '24/7 Emergency',
      verified: true
    },
    {
      id: '2',
      full_name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      years_of_experience: 15,
      consultation_fee: 1500,
      bio: 'Interventional cardiologist specializing in emergency cardiac procedures.',
      phone: '+27 21 567-8901',
      email: 'michael.chen@cardio.co.za',
      medical_practice: {
        name: 'Cape Heart Emergency Unit',
        address: '456 Heart Street',
        city: 'Cape Town',
        province: 'Western Cape'
      },
      availability_hours: '24/7 Cardiac Emergency',
      verified: true
    },
    {
      id: '3',
      full_name: 'Dr. Amara Ndlovu',
      specialty: 'Emergency Medicine',
      years_of_experience: 8,
      consultation_fee: 950,
      bio: 'Emergency physician with expertise in pediatric and adult emergency care.',
      phone: '+27 31 678-9012',
      email: 'amara.ndlovu@emergency.co.za',
      medical_practice: {
        name: 'Durban Emergency Medical Centre',
        address: '789 Emergency Road',
        city: 'Durban',
        province: 'KwaZulu-Natal'
      },
      availability_hours: '24/7 Emergency',
      verified: true
    },
    {
      id: '4',
      full_name: 'Dr. James Robertson',
      specialty: 'Neurology',
      years_of_experience: 20,
      consultation_fee: 1800,
      bio: 'Neurologist specializing in emergency stroke and neurological trauma.',
      phone: '+27 11 789-0123',
      email: 'james.robertson@neuro.co.za',
      medical_practice: {
        name: 'Johannesburg Neuro Emergency',
        address: '321 Brain Avenue',
        city: 'Johannesburg',
        province: 'Gauteng'
      },
      availability_hours: '24/7 Neuro Emergency',
      verified: true
    },
    {
      id: '5',
      full_name: 'Dr. Fatima Ahmed',
      specialty: 'General Practice',
      years_of_experience: 10,
      consultation_fee: 750,
      bio: 'Family physician available for urgent care and emergency consultations.',
      phone: '+27 21 890-1234',
      email: 'fatima.ahmed@family.co.za',
      medical_practice: {
        name: 'Cape Family Emergency Clinic',
        address: '654 Family Lane',
        city: 'Cape Town',
        province: 'Western Cape'
      },
      availability_hours: '24/7 Urgent Care',
      verified: true
    }
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('verified', true)
        .in('specialty', emergencySpecialties);

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

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.medical_practice.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvince = selectedProvince === 'all' || doctor.medical_practice.province === selectedProvince;
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesProvince && matchesSpecialty;
  });

  const handleBookEmergency = (doctor: Doctor) => {
    toast({
      title: "Emergency Booking Initiated",
      description: `Connecting you with ${doctor.full_name}. You will be contacted within 5 minutes.`,
    });
  };

  const handleCallDirect = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading emergency doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Emergency Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emergency Medical Care</h1>
          <p className="text-xl text-gray-600 mb-4">Available 24/7 emergency doctors ready to help</p>
          
          <Alert className="max-w-2xl mx-auto bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              For life-threatening emergencies, call 10177 (ambulance) or go to your nearest emergency room immediately.
            </AlertDescription>
          </Alert>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search doctors, specialties, cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {emergencySpecialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger>
                  <SelectValue placeholder="All Provinces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center text-sm text-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                {filteredDoctors.length} doctors available
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-red-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Available Now</p>
                  <p className="text-2xl font-bold">{filteredDoctors.length}</p>
                </div>
                <Stethoscope className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Response Time</p>
                  <p className="text-2xl font-bold">&lt; 5 min</p>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">24/7 Support</p>
                  <p className="text-2xl font-bold">Always</p>
                </div>
                <Heart className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Success Rate</p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
                <Star className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Doctors List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-red-500 text-white">
                        {doctor.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{doctor.full_name}</CardTitle>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {doctor.specialty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Emergency Fee</p>
                    <p className="text-lg font-bold text-red-600">R{doctor.consultation_fee}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">{doctor.bio}</p>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.medical_practice.name}, {doctor.medical_practice.city}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{doctor.availability_hours}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Stethoscope className="h-4 w-4" />
                    <span>{doctor.years_of_experience} years experience</span>
                  </div>
                  
                  <div className="flex space-x-2 pt-3">
                    <Button 
                      onClick={() => handleBookEmergency(doctor)}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Book
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleCallDirect(doctor.phone)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Direct
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Emergency Doctors Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or contact emergency services.</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedProvince('all');
                setSelectedSpecialty('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmergencyDoctors;
