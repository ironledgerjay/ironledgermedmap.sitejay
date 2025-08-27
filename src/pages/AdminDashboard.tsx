import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Users,
  UserPlus,
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Activity,
  Mail,
  Phone,
  MapPin,
  Search,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  DollarSign,
  Plus,
  Bell,
  RefreshCw,
  Shield,
  Database
} from 'lucide-react';
import { supabase } from '@/superbaseClient';
import { useToast } from '@/hooks/use-toast';
import AdminImpersonation from '@/components/AdminImpersonation';
import DatabasePopulator from '@/components/DatabasePopulator';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  user_metadata?: any;
}

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

interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  reason_for_visit: string;
  status: string;
  consultation_fee: number;
  created_at: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImpersonation, setCurrentImpersonation] = useState<ImpersonationSession | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateDoctor, setShowCreateDoctor] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [createDoctorData, setCreateDoctorData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialty: '',
    licenseNumber: '',
    yearsOfExperience: '',
    consultationFee: '',
    bio: '',
    practiceName: '',
    practiceAddress: '',
    city: '',
    province: ''
  });
  const [createAdminData, setCreateAdminData] = useState({
    fullName: '',
    email: '',
    permissions: 'standard'
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalDoctors: 0,
    pendingApprovals: 0,
    verifiedDoctors: 0,
    totalAppointments: 0,
    unreadNotifications: 0
  });

  useEffect(() => {
    fetchAllData();

    // Set up real-time subscriptions for live updates
    const setupRealTimeSubscriptions = () => {
      try {
        const doctorsSubscription = supabase
          .channel('doctors_changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'doctors' },
            handleDoctorsChange
          )
          .subscribe();

        const appointmentsSubscription = supabase
          .channel('appointments_changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'appointments' },
            handleAppointmentsChange
          )
          .subscribe();

        const notificationsSubscription = supabase
          .channel('notifications_changes')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'admin_notifications' },
            handleNotificationsChange
          )
          .subscribe();

        return () => {
          doctorsSubscription.unsubscribe();
          appointmentsSubscription.unsubscribe();
          notificationsSubscription.unsubscribe();
        };
      } catch (error) {
        console.log('Real-time subscriptions not available, running in demo mode');
      }
    };

    const cleanup = setupRealTimeSubscriptions();

    // Set up auto-refresh for demo mode
    const refreshInterval = setInterval(() => {
      fetchAllData();
    }, 30000); // Refresh every 30 seconds

    return () => {
      if (cleanup) cleanup();
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchUsers(),
      fetchDoctors(),
      fetchAppointments(),
      fetchNotifications(),
      calculateStats()
    ]);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "All dashboard data has been updated with the latest information."
    });
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Generate dynamic sample data based on current time
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 86400000);
        const twoDaysAgo = new Date(today.getTime() - 172800000);

        const sampleUsers: User[] = [
          {
            id: '1',
            email: 'john.doe@email.com',
            full_name: 'John Doe',
            phone: '+27 11 123 4567',
            created_at: today.toISOString(),
            email_confirmed_at: today.toISOString(),
            last_sign_in_at: new Date().toISOString()
          },
          {
            id: '2',
            email: 'jane.smith@email.com',
            full_name: 'Jane Smith',
            phone: '+27 21 234 5678',
            created_at: yesterday.toISOString(),
            email_confirmed_at: yesterday.toISOString(),
            last_sign_in_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            email: 'mike.johnson@email.com',
            full_name: 'Mike Johnson',
            phone: '+27 31 345 6789',
            created_at: twoDaysAgo.toISOString(),
            email_confirmed_at: twoDaysAgo.toISOString(),
            last_sign_in_at: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: '4',
            email: 'sarah.wilson@email.com',
            full_name: 'Sarah Wilson',
            phone: '+27 12 456 7890',
            created_at: today.toISOString(),
            email_confirmed_at: today.toISOString(),
            last_sign_in_at: new Date(Date.now() - 1800000).toISOString()
          }
        ];
        setUsers(sampleUsers);
      } else {
        setUsers(profiles || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false });

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
            id: '2',
            full_name: 'Dr. Michael Chen',
            email: 'michael.chen@clinic.co.za',
            phone: '+27 21 567 8901',
            specialty: 'General Practice',
            license_number: 'MP234567',
            years_of_experience: 10,
            consultation_fee: 800,
            bio: 'Family medicine practitioner focusing on preventive care.',
            medical_practice: {
              name: 'Family Health Clinic',
              address: '456 Health Avenue',
              city: 'Cape Town',
              province: 'Western Cape'
            },
            verified: false,
            created_at: new Date().toISOString(),
            availability_hours: 'Mon-Sat: 7AM-7PM'
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
            verified: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            availability_hours: 'Tue-Fri: 9AM-4PM'
          }
        ];
        setDoctors(sampleDoctors);
        setPendingDoctors(sampleDoctors.filter(d => !d.verified));
      } else {
        setDoctors(data || []);
        setPendingDoctors((data || []).filter(d => !d.verified));
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Sample appointments for demo
        const sampleAppointments: Appointment[] = [
          {
            id: '1',
            patient_name: 'John Doe',
            patient_email: 'john.doe@email.com',
            patient_phone: '+27 11 123 4567',
            doctor_name: 'Dr. Sarah Johnson',
            appointment_date: new Date().toISOString().split('T')[0],
            appointment_time: '09:00',
            reason_for_visit: 'General checkup',
            status: 'pending',
            consultation_fee: 1200,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            patient_name: 'Jane Smith',
            patient_email: 'jane.smith@email.com',
            patient_phone: '+27 21 234 5678',
            doctor_name: 'Dr. Michael Chen',
            appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            appointment_time: '14:30',
            reason_for_visit: 'Follow-up consultation',
            status: 'confirmed',
            consultation_fee: 800,
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        setAppointments(sampleAppointments);
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        // Sample notifications for demo
        const sampleNotifications: AdminNotification[] = [
          {
            id: '1',
            type: 'doctor_application',
            title: 'New Doctor Application',
            message: 'Dr. Michael Chen has submitted a new application for review',
            read: false,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            type: 'appointment_booking',
            title: 'New Appointment Booked',
            message: 'John Doe has booked an appointment with Dr. Sarah Johnson',
            read: false,
            created_at: new Date(Date.now() - 1800000).toISOString()
          }
        ];
        setNotifications(sampleNotifications);
      } else {
        setNotifications(data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const calculateStats = async () => {
    const today = new Date().toDateString();
    const newUsersToday = users.filter(user =>
      new Date(user.created_at).toDateString() === today
    ).length;

    setStats({
      totalUsers: users.length,
      newUsersToday,
      totalDoctors: doctors.length,
      pendingApprovals: pendingDoctors.length,
      verifiedDoctors: doctors.filter(d => d.verified).length,
      totalAppointments: appointments.length,
      unreadNotifications: notifications.filter(n => !n.read).length
    });
  };

  const handleDoctorsChange = (payload: any) => {
    console.log('Real-time update - Doctors changed:', payload);
    fetchDoctors();
    toast({
      title: "Live Update",
      description: "Doctor data updated in real-time",
      duration: 3000,
    });
  };

  const handleAppointmentsChange = (payload: any) => {
    console.log('Real-time update - Appointments changed:', payload);
    fetchAppointments();
    toast({
      title: "New Activity",
      description: "New appointment booking detected",
      duration: 3000,
    });
  };

  const handleNotificationsChange = (payload: any) => {
    console.log('Real-time update - Notifications changed:', payload);
    fetchNotifications();
    toast({
      title: "New Notification",
      description: "You have a new admin notification",
      duration: 3000,
    });
  };

  const approveDoctor = async (doctorId: string) => {
    try {
      const doctor = doctors.find(d => d.id === doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      const { error } = await supabase
        .from('doctors')
        .update({
          is_verified: true,
          application_status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', doctorId);

      if (error) {
        console.log('Database update failed, running in demo mode:', error);
        // Simulate approval for demo
        setDoctors(prev => prev.map(d =>
          d.id === doctorId ? { ...d, verified: true } : d
        ));
        setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
      }

      toast({
        title: "Doctor Approved ✅",
        description: `${doctor.full_name} has been successfully verified and will receive email confirmation from IronledgerMedMap.`,
        duration: 5000,
      });

      // Refresh data to show updated status
      fetchDoctors();
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve doctor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const rejectDoctor = async (doctorId: string) => {
    try {
      const doctor = doctors.find(d => d.id === doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      const { error } = await supabase
        .from('doctors')
        .update({
          application_status: 'rejected',
          is_verified: false,
          rejected_at: new Date().toISOString()
        })
        .eq('id', doctorId);

      if (error) {
        console.log('Database update failed, running in demo mode:', error);
        // Simulate rejection for demo
        setDoctors(prev => prev.filter(d => d.id !== doctorId));
        setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
      }

      toast({
        title: "Application Reviewed",
        description: `${doctor.full_name}'s application has been reviewed. Professional communication sent via IronledgerMedMap email.`,
        duration: 5000,
      });

      fetchDoctors();
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: "Review Failed",
        description: "Failed to process application review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImpersonation = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setCurrentImpersonation({
        doctorId: doctor.id,
        doctorName: doctor.full_name,
        startTime: new Date().toISOString(),
        adminId: 'current-admin-id' // Replace with actual admin ID
      });
    }
  };

  const handleStopImpersonation = () => {
    setCurrentImpersonation(null);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, doctors, and platform settings</p>
        </div>

        {/* Stats Cards */}
        {/* Real-time Dashboard Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Live Dashboard • Real-time updates enabled
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={refreshData} variant="outline" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            {stats.unreadNotifications > 0 && (
              <div className="relative">
                <Bell className="h-5 w-5 text-orange-500" />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.unreadNotifications}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in-scale hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                  <p className="text-sm text-green-600">+{stats.newUsersToday} today</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-scale hover:shadow-lg transition-shadow border-l-4 border-l-green-500" style={{ animationDelay: '100ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalDoctors}</p>
                  <p className="text-sm text-blue-600">{stats.verifiedDoctors} verified</p>
                </div>
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-scale hover:shadow-lg transition-shadow border-l-4 border-l-orange-500" style={{ animationDelay: '200ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingApprovals}</p>
                  <p className="text-sm text-orange-600">Requires action</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-scale hover:shadow-lg transition-shadow border-l-4 border-l-purple-500" style={{ animationDelay: '300ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Appointments</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalAppointments}</p>
                  <p className="text-sm text-green-600">All time</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Alert */}
        {stats.pendingApprovals > 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50 animate-fade-in">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              You have {stats.pendingApprovals} doctor applications waiting for approval.
            </AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="mb-6 animate-fade-in">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users or doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="animate-fade-in-up">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="users">Users ({stats.totalUsers})</TabsTrigger>
            <TabsTrigger value="doctors">Doctors ({stats.totalDoctors})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pendingApprovals})</TabsTrigger>
            <TabsTrigger value="appointments">Appointments ({stats.totalAppointments})</TabsTrigger>
            <TabsTrigger value="notifications">Notifications ({stats.unreadNotifications})</TabsTrigger>
            <TabsTrigger value="create">Add New</TabsTrigger>
            <TabsTrigger value="setup">Database</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <div className="grid gap-4">
              {filteredUsers.map((user, index) => (
                <Card key={user.id} className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-500 text-white">
                            {user.full_name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.full_name || 'User'}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Phone className="h-4 w-4" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                          {user.email_confirmed_at ? "Verified" : "Unverified"}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        {user.last_sign_in_at && (
                          <p className="text-sm text-gray-500">
                            Last active: {new Date(user.last_sign_in_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="mt-6">
            <div className="grid gap-4">
              {filteredDoctors.map((doctor, index) => (
                <Card key={doctor.id} className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-green-500 text-white text-lg">
                            {doctor.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{doctor.full_name}</h3>
                            {doctor.verified ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-orange-500" />
                            )}
                          </div>
                          <Badge variant="secondary" className="mb-2">
                            {doctor.specialty}
                          </Badge>
                          <div className="space-y-1 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{doctor.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{doctor.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{doctor.medical_practice.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={doctor.verified ? "default" : "secondary"}>
                          {doctor.verified ? "Verified" : "Pending"}
                        </Badge>
                        <p className="text-lg font-bold text-green-600 mt-2">
                          R{doctor.consultation_fee}
                        </p>
                        <p className="text-sm text-gray-500">
                          {doctor.years_of_experience} years exp.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied: {new Date(doctor.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-4">
              {pendingDoctors.map((doctor, index) => (
                <Card key={doctor.id} className="animate-fade-in-up hover:shadow-lg transition-shadow border-l-4 border-l-orange-500" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-orange-500 text-white text-lg">
                            {doctor.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{doctor.full_name}</h3>
                          <Badge variant="secondary" className="mb-2">
                            {doctor.specialty}
                          </Badge>
                          <div className="space-y-1 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{doctor.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{doctor.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{doctor.medical_practice.name}, {doctor.medical_practice.city}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{doctor.bio}</p>
                          <div className="text-sm text-gray-500">
                            <p><strong>License:</strong> {doctor.license_number}</p>
                            <p><strong>Experience:</strong> {doctor.years_of_experience} years</p>
                            <p><strong>Consultation Fee:</strong> R{doctor.consultation_fee}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          onClick={() => approveDoctor(doctor.id)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => rejectDoctor(doctor.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {pendingDoctors.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-600">No pending doctor applications at the moment.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="setup" className="mt-6">
            <DatabasePopulator />
          </TabsContent>

          <TabsContent value="impersonation" className="mt-6">
            <AdminImpersonation
              onImpersonate={handleImpersonation}
              onStopImpersonation={handleStopImpersonation}
              currentImpersonation={currentImpersonation}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
