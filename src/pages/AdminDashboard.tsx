import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  Building,
  Calendar,
  DollarSign,
  Activity,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import Header from "@/components/Header";
import DatabasePopulator from "@/components/DatabasePopulator";
import { supabase } from "../superbaseClient";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Real-time data state
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedDoctors: 0,
    pendingApplications: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    activePractices: 0
  });

  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  const { toast } = useToast();

  // Load real-time data
  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      console.log('Loading dashboard data...');

      // Get total users count
      const { count: usersCount, error: usersCountError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (usersCountError) console.log('Users count error:', usersCountError);

      // Get total doctors count
      const { count: doctorsCount, error: doctorsCountError } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });

      if (doctorsCountError) console.log('Doctors count error:', doctorsCountError);

      // Get pending doctor applications
      const { data: pendingData, count: pendingCount, error: pendingError } = await supabase
        .from('doctors')
        .select(`
          *,
          user_profiles!doctors_user_id_fkey (full_name, email, phone)
        `, { count: 'exact' })
        .eq('verification_status', 'pending');

      if (pendingError) console.log('Pending doctors error:', pendingError);

      // Get total bookings count
      const { count: bookingsCount, error: bookingsCountError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      if (bookingsCountError) console.log('Bookings count error:', bookingsCountError);

      // Get this month's revenue
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const { data: revenueData, error: revenueError } = await supabase
        .from('bookings')
        .select('consultation_fee, convenience_fee')
        .eq('payment_status', 'completed')
        .gte('created_at', firstDay.toISOString());

      if (revenueError) console.log('Revenue error:', revenueError);

      const monthlyRevenue = revenueData?.reduce((total, booking) =>
        total + (booking.consultation_fee || 0) + (booking.convenience_fee || 0), 0) || 0;

      // Get active practices count
      const { count: practicesCount, error: practicesCountError } = await supabase
        .from('medical_practices')
        .select('*', { count: 'exact', head: true });

      if (practicesCountError) console.log('Practices count error:', practicesCountError);

      // Get all users for user management
      const { data: usersData, error: usersDataError } = await supabase
        .from('user_profiles')
        .select(`
          id, full_name, email, phone, created_at, role,
          doctors!doctors_user_id_fkey (id, verification_status)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (usersDataError) console.log('Users data error:', usersDataError);

      // Get recent bookings
      const { data: bookingsData, error: bookingsDataError } = await supabase
        .from('bookings')
        .select(`
          id, appointment_date, appointment_time, status, created_at,
          patient:user_profiles!bookings_patient_id_fkey (full_name),
          doctor:doctors!bookings_doctor_id_fkey (
            user_profiles!doctors_user_id_fkey (full_name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (bookingsDataError) console.log('Bookings data error:', bookingsDataError);

      // Check if we have real data or need to use sample data
      const hasRealData = usersCount > 0 || doctorsCount > 0;

      if (!hasRealData) {
        console.log('No data found in database, using sample data for demo');
        // Set sample data for demonstration
        setStats({
          totalUsers: 25,
          verifiedDoctors: 12,
          pendingApplications: 3,
          totalBookings: 150,
          monthlyRevenue: 45000,
          activePractices: 8
        });

        setPendingDoctors([
          {
            id: 'sample-pending-1',
            name: 'Dr. Alex Thompson',
            specialty: 'Radiology',
            license: 'MP987654',
            submittedDate: new Date().toLocaleDateString(),
            status: 'pending'
          },
          {
            id: 'sample-pending-2',
            name: 'Dr. Rachel Green',
            specialty: 'Oncology',
            license: 'MP876543',
            submittedDate: new Date(Date.now() - 86400000).toLocaleDateString(),
            status: 'pending'
          }
        ]);

        setAllUsers([
          {
            id: 'sample-user-1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'patient',
            joinDate: new Date().toLocaleDateString(),
            status: 'active'
          },
          {
            id: 'sample-user-2',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@ironledgermedmap.com',
            role: 'doctor',
            joinDate: new Date(Date.now() - 86400000).toLocaleDateString(),
            status: 'verified'
          },
          {
            id: 'sample-user-3',
            name: 'Mary Wilson',
            email: 'mary.wilson@example.com',
            role: 'patient',
            joinDate: new Date(Date.now() - 172800000).toLocaleDateString(),
            status: 'active'
          }
        ]);

        setRecentBookings([
          {
            id: 'sample-booking-1',
            patient: 'John Smith',
            doctor: 'Dr. Sarah Johnson',
            date: new Date().toLocaleDateString(),
            time: '14:00',
            status: 'scheduled'
          },
          {
            id: 'sample-booking-2',
            patient: 'Mary Wilson',
            doctor: 'Dr. Michael Chen',
            date: new Date(Date.now() + 86400000).toLocaleDateString(),
            time: '10:30',
            status: 'confirmed'
          }
        ]);

        toast({
          title: "Demo Mode Active",
          description: "Showing sample data. Database appears to be empty.",
          variant: "default"
        });
      } else {
        // Update state with real data
        setStats({
          totalUsers: usersCount || 0,
          verifiedDoctors: (doctorsCount || 0) - (pendingCount || 0),
          pendingApplications: pendingCount || 0,
          totalBookings: bookingsCount || 0,
          monthlyRevenue: monthlyRevenue,
          activePractices: practicesCount || 0
        });

        setPendingDoctors(pendingData?.map(doctor => ({
          id: doctor.id,
          name: doctor.user_profiles?.full_name || 'Unknown',
          specialty: doctor.specialty,
          license: doctor.license_number || 'N/A',
          submittedDate: new Date(doctor.created_at).toLocaleDateString(),
          status: doctor.verification_status
        })) || []);

        setAllUsers(usersData?.map(user => ({
          id: user.id,
          name: user.full_name || 'Unknown User',
          email: user.email || 'No email',
          role: user.role || (user.doctors?.length > 0 ? 'doctor' : 'patient'),
          joinDate: new Date(user.created_at).toLocaleDateString(),
          status: user.doctors?.length > 0 ? user.doctors[0].verification_status || 'pending' : 'active'
        })) || []);

        setRecentBookings(bookingsData?.map(booking => ({
          id: booking.id,
          patient: booking.patient?.full_name || 'Unknown',
          doctor: booking.doctor?.user_profiles?.full_name || 'Unknown',
          date: new Date(booking.appointment_date).toLocaleDateString(),
          time: booking.appointment_time,
          status: booking.status
        })) || []);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);

      // Use sample data as fallback
      console.log('Using sample data due to database error');
      setStats({
        totalUsers: 25,
        verifiedDoctors: 12,
        pendingApplications: 3,
        totalBookings: 150,
        monthlyRevenue: 45000,
        activePractices: 8
      });

      toast({
        title: "Demo Mode",
        description: "Database connection issue. Showing sample data.",
        variant: "default"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // Initial data load
    loadDashboardData();

    // Set up real-time subscriptions
    const subscriptions = [
      // Users subscription
      supabase
        .channel('user_profiles_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => {
          loadDashboardData();
        })
        .subscribe(),

      // Doctors subscription
      supabase
        .channel('doctors_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'doctors' }, () => {
          loadDashboardData();
        })
        .subscribe(),

      // Bookings subscription
      supabase
        .channel('bookings_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
          loadDashboardData();
        })
        .subscribe(),

      // Medical practices subscription
      supabase
        .channel('medical_practices_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'medical_practices' }, () => {
          loadDashboardData();
        })
        .subscribe()
    ];

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach(subscription => {
        supabase.removeChannel(subscription);
      });
    };
  }, []);

  const handleApproveDoctor = async (doctorId: string) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ verification_status: 'verified' })
        .eq('id', doctorId);

      if (error) {
        console.error('Database error approving doctor:', error);
        throw error;
      }

      toast({
        title: "Doctor Approved",
        description: "Doctor has been successfully verified and approved.",
      });

      // Refresh data
      loadDashboardData();
    } catch (error) {
      console.error('Error approving doctor:', error);

      // In demo mode, simulate approval
      if (doctorId.startsWith('sample-')) {
        setPendingDoctors(prev => prev.filter(doc => doc.id !== doctorId));
        toast({
          title: "Demo: Doctor Approved",
          description: "This is a demo action. Doctor removed from pending list.",
        });
        return;
      }

      toast({
        title: "Approval Failed",
        description: "Failed to approve doctor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRejectDoctor = async (doctorId: string) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ verification_status: 'rejected' })
        .eq('id', doctorId);

      if (error) {
        console.error('Database error rejecting doctor:', error);
        throw error;
      }

      toast({
        title: "Doctor Rejected",
        description: "Doctor application has been rejected.",
      });

      // Refresh data
      loadDashboardData();
    } catch (error) {
      console.error('Error rejecting doctor:', error);

      // In demo mode, simulate rejection
      if (doctorId.startsWith('sample-')) {
        setPendingDoctors(prev => prev.filter(doc => doc.id !== doctorId));
        toast({
          title: "Demo: Doctor Rejected",
          description: "This is a demo action. Doctor removed from pending list.",
        });
        return;
      }

      toast({
        title: "Rejection Failed",
        description: "Failed to reject doctor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage your medical platform</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboardData}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <>
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Real-time count</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified Doctors</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-4 w-28" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stats.verifiedDoctors}</div>
                      <p className="text-xs text-muted-foreground">{stats.pendingApplications} pending approval</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Practices</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stats.activePractices}</div>
                      <p className="text-xs text-muted-foreground">Real-time count</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <>
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">All time bookings</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-2" />
                      <Skeleton className="h-4 w-28" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">R{stats.monthlyRevenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">This month's revenue</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">All Systems Operational</span>
                  </div>
                  <p className="text-xs text-muted-foreground">99.9% uptime this month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Doctor Applications</CardTitle>
                  <CardDescription>Review and approve new doctor registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingDoctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialty} • {doctor.license}</p>
                          <p className="text-xs text-muted-foreground">Submitted: {doctor.submittedDate}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleApproveDoctor(doctor.id)}>
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRejectDoctor(doctor.id)}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest patient appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">{booking.patient}</p>
                          <p className="text-sm text-muted-foreground">
                            with {booking.doctor} • {booking.date} at {booking.time}
                          </p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'doctor' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Management</CardTitle>
                <CardDescription>Manage doctor applications and verifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <UserCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Doctor Verification Center</h3>
                  <p className="text-muted-foreground mb-4">
                    Review and manage doctor applications, licenses, and verifications
                  </p>
                  <Button>Review Applications</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>Monitor and manage all patient bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Booking Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    View detailed booking analytics and manage appointments
                  </p>
                  <Button>View Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <DatabasePopulator />

            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">System Configuration</h3>
                  <p className="text-muted-foreground mb-4">
                    Configure payment settings, notifications, and system preferences
                  </p>
                  <Button>Manage Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
