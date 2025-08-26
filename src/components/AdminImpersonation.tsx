import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  UserCheck,
  Eye,
  LogOut,
  Stethoscope,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/superbaseClient';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  specialty: string;
  license_number: string;
  years_of_experience: number;
  consultation_fee: number;
  bio: string;
  medical_practice: {
    name: string;
    address: string;
    city: string;
    province: string;
  };
  verified: boolean;
  created_at: string;
  availability_hours: string;
}

interface ImpersonationSession {
  doctorId: string;
  doctorName: string;
  startTime: string;
  adminId: string;
}

interface AdminImpersonationProps {
  onImpersonate?: (doctorId: string) => void;
  onStopImpersonation?: () => void;
  currentImpersonation?: ImpersonationSession | null;
}

const AdminImpersonation = ({ 
  onImpersonate, 
  onStopImpersonation, 
  currentImpersonation 
}: AdminImpersonationProps) => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [impersonationHistory, setImpersonationHistory] = useState<ImpersonationSession[]>([]);

  useEffect(() => {
    fetchDoctors();
    fetchImpersonationHistory();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('verified', true)
        .order('full_name', { ascending: true });

      if (error) {
        // Use sample data if table doesn't exist
        const sampleDoctors: Doctor[] = [
          {
            id: '1',
            full_name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@medical.co.za',
            phone: '+27 11 456 7890',
            specialty: 'Cardiology',
            license_number: 'MP123456',
            years_of_experience: 15,
            consultation_fee: 1200,
            bio: 'Experienced cardiologist with expertise in interventional procedures.',
            medical_practice: {
              name: 'Heart Care Centre',
              address: '123 Medical Street',
              city: 'Johannesburg',
              province: 'Gauteng'
            },
            verified: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            availability_hours: 'Mon-Fri: 8AM-5PM'
          },
          {
            id: '3',
            full_name: 'Dr. Amara Ndlovu',
            email: 'amara.ndlovu@dermatology.co.za',
            phone: '+27 31 678 9012',
            specialty: 'Dermatology',
            license_number: 'MP345678',
            years_of_experience: 12,
            consultation_fee: 950,
            bio: 'Dermatologist specializing in skin cancer prevention.',
            medical_practice: {
              name: 'Skin Health Institute',
              address: '789 Skin Care Road',
              city: 'Durban',
              province: 'KwaZulu-Natal'
            },
            verified: true,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            availability_hours: 'Tue-Fri: 9AM-4PM'
          }
        ];
        setDoctors(sampleDoctors);
      } else {
        setDoctors(data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImpersonationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_impersonation_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        // Use sample data if table doesn't exist
        const sampleHistory: ImpersonationSession[] = [
          {
            doctorId: '1',
            doctorName: 'Dr. Sarah Johnson',
            startTime: new Date(Date.now() - 3600000).toISOString(),
            adminId: 'admin-1'
          }
        ];
        setImpersonationHistory(sampleHistory);
      } else {
        setImpersonationHistory(data || []);
      }
    } catch (error) {
      console.error('Error fetching impersonation history:', error);
    }
  };

  const startImpersonation = async (doctor: Doctor) => {
    try {
      const impersonationSession: ImpersonationSession = {
        doctorId: doctor.id,
        doctorName: doctor.full_name,
        startTime: new Date().toISOString(),
        adminId: 'current-admin-id' // Replace with actual admin ID
      };

      // Log the impersonation attempt
      const { error } = await supabase
        .from('admin_impersonation_log')
        .insert({
          admin_id: impersonationSession.adminId,
          doctor_id: impersonationSession.doctorId,
          doctor_name: impersonationSession.doctorName,
          action: 'start_impersonation',
          timestamp: impersonationSession.startTime,
          details: `Admin started impersonating ${doctor.full_name}`
        });

      if (error) {
        console.error('Logging error:', error);
      }

      // Call the callback to handle impersonation in parent component
      if (onImpersonate) {
        onImpersonate(doctor.id);
      }

      toast({
        title: "Impersonation Started",
        description: `You are now viewing the dashboard as ${doctor.full_name}. Remember to respect patient privacy.`,
        duration: 5000,
      });

      // Update local history
      setImpersonationHistory(prev => [impersonationSession, ...prev]);

    } catch (error) {
      console.error('Error starting impersonation:', error);
      toast({
        title: "Impersonation Failed",
        description: "Failed to start impersonation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopImpersonation = async () => {
    if (!currentImpersonation) return;

    try {
      // Log the end of impersonation
      const { error } = await supabase
        .from('admin_impersonation_log')
        .insert({
          admin_id: currentImpersonation.adminId,
          doctor_id: currentImpersonation.doctorId,
          doctor_name: currentImpersonation.doctorName,
          action: 'end_impersonation',
          timestamp: new Date().toISOString(),
          details: `Admin ended impersonation of ${currentImpersonation.doctorName}`
        });

      if (error) {
        console.error('Logging error:', error);
      }

      // Call the callback to handle stopping impersonation
      if (onStopImpersonation) {
        onStopImpersonation();
      }

      toast({
        title: "Impersonation Ended",
        description: `You have stopped impersonating ${currentImpersonation.doctorName}.`,
        duration: 3000,
      });

    } catch (error) {
      console.error('Error stopping impersonation:', error);
      toast({
        title: "Error",
        description: "Failed to properly end impersonation session.",
        variant: "destructive"
      });
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  if (currentImpersonation) {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="text-orange-800">
            <strong>Admin Impersonation Active:</strong> You are viewing the dashboard as {currentImpersonation.doctorName}
            <div className="text-sm mt-1">
              Started at: {new Date(currentImpersonation.startTime).toLocaleString()}
            </div>
          </div>
          <Button 
            onClick={stopImpersonation}
            variant="outline" 
            size="sm"
            className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Impersonation
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Doctor Impersonation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Privacy Notice:</strong> Impersonation is logged for security and compliance. 
              Only use this feature for legitimate support purposes and respect patient confidentiality.
            </AlertDescription>
          </Alert>

          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors by name, email, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {doctor.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{doctor.full_name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Badge variant="secondary">{doctor.specialty}</Badge>
                      <span>•</span>
                      <span>{doctor.years_of_experience} years exp.</span>
                    </div>
                    <p className="text-sm text-gray-500">{doctor.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => startImpersonation(doctor)}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Impersonate
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Doctors Found</h3>
              <p className="text-gray-600">Try adjusting your search filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {impersonationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Impersonation History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {impersonationHistory.slice(0, 5).map((session, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{session.doctorName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.startTime).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">Logged</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminImpersonation;
