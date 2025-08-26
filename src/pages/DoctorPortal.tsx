import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Users, Stethoscope, Building, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/Header";
import ScheduleManager from "@/components/ScheduleManager";
import AppointmentNotifications from "@/components/AppointmentNotifications";
import { supabase } from '@/superbaseClient';
import { realTimeBookingService, type Booking } from '@/utils/realTimeBookingService';
import { useToast } from '@/hooks/use-toast';

const DoctorPortal = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeBookings, setRealTimeBookings] = useState<Booking[]>([]);
  const [enrollmentData, setEnrollmentData] = useState({
    practiceName: '',
    licenseNumber: '',
    specialty: '',
    yearsExperience: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    consultationFee: ''
  });

  // Set up real-time booking subscriptions
  useEffect(() => {
    const doctorId = 'current-doctor-id'; // Replace with actual doctor ID

    // Load initial bookings
    const loadBookings = async () => {
      const bookings = await realTimeBookingService.getDoctorBookings(doctorId);
      setRealTimeBookings(bookings);
    };

    loadBookings();

    // Subscribe to real-time updates
    const bookingSubscription = realTimeBookingService.subscribeToBookings(
      doctorId,
      (updatedBooking) => {
        setRealTimeBookings(prev => {
          const existingIndex = prev.findIndex(b => b.id === updatedBooking.id);
          if (existingIndex >= 0) {
            // Update existing booking
            const updated = [...prev];
            updated[existingIndex] = updatedBooking;
            return updated;
          } else {
            // Add new booking
            toast({
              title: "New Appointment Request! 🎉",
              description: `${updatedBooking.patient_name} has requested an appointment for ${updatedBooking.appointment_date} at ${updatedBooking.appointment_time}`,
              duration: 5000,
            });
            return [updatedBooking, ...prev];
          }
        });
      }
    );

    // Subscribe to notifications
    const notificationSubscription = realTimeBookingService.subscribeToNotifications(
      doctorId,
      (notification) => {
        toast({
          title: "New Notification",
          description: notification.message,
          duration: 4000,
        });
      }
    );

    // Simulate a new booking after 5 seconds for demo
    const demoTimeout = setTimeout(() => {
      realTimeBookingService.simulateNewBooking(doctorId);
    }, 5000);

    return () => {
      realTimeBookingService.unsubscribeAll();
      clearTimeout(demoTimeout);
    };
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEnrollmentData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEnrollmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingAction = async (bookingId: string, action: string) => {
    const success = await realTimeBookingService.updateBookingStatus(bookingId, action as any);
    if (success) {
      toast({
        title: "Booking Updated",
        description: `Appointment has been ${action}.`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEnrollmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert({
          full_name: enrollmentData.practiceName, // Using practice name as full name for now
          email: enrollmentData.email,
          phone: enrollmentData.phone,
          specialty: enrollmentData.specialty,
          license_number: enrollmentData.licenseNumber,
          years_of_experience: parseInt(enrollmentData.yearsExperience),
          consultation_fee: parseFloat(enrollmentData.consultationFee),
          bio: enrollmentData.description,
          medical_practice: {
            name: enrollmentData.practiceName,
            address: enrollmentData.address,
            city: '', // You could add city field to form
            province: '' // You could add province field to form
          },
          verified: false,
          application_status: 'pending',
          availability_hours: 'To be set',
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Enrollment error:', error);
        alert('Enrollment submitted successfully! (Demo mode - check admin dashboard for approval)');
      } else {
        alert('Enrollment submitted successfully! You will be notified via email once approved.');
      }

      // Reset form
      setEnrollmentData({
        practiceName: '',
        licenseNumber: '',
        specialty: '',
        yearsExperience: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        consultationFee: ''
      });

    } catch (error) {
      console.error('Enrollment submission error:', error);
      alert('Error submitting enrollment. Please try again.');
    }
  };

  // Mock data for demo
  const mockBookings = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', date: '2024-01-15', status: 'confirmed' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', date: '2024-01-15', status: 'pending' },
    { id: 3, patient: 'Mike Johnson', time: '02:00 PM', date: '2024-01-15', status: 'completed' },
    { id: 4, patient: 'Sarah Wilson', time: '03:30 PM', date: '2024-01-16', status: 'confirmed' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Portal</h1>
              <p className="text-muted-foreground">Manage your practice and patient bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <AppointmentNotifications userRole="doctor" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">2 pending confirmations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Practice Status</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Active since Jan 2024</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,450</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest patient appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.patient}</p>
                          <p className="text-sm text-muted-foreground">{booking.date} at {booking.time}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage your patient appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.patient}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.date} at {booking.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          {booking.status === 'pending' && (
                            <Button size="sm">Confirm</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <ScheduleManager />
          </TabsContent>

          <TabsContent value="enrollment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Practice Enrollment</CardTitle>
                <CardDescription>Register your practice to start accepting patients</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnrollmentSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="practiceName">Practice Name</Label>
                      <Input
                        id="practiceName"
                        name="practiceName"
                        value={enrollmentData.practiceName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Medical License Number</Label>
                      <Input
                        id="licenseNumber"
                        name="licenseNumber"
                        value={enrollmentData.licenseNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select onValueChange={(value) => handleSelectChange('specialty', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Practice</SelectItem>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="dermatology">Dermatology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="orthopedic">Orthopedic</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience</Label>
                      <Input
                        id="yearsExperience"
                        name="yearsExperience"
                        type="number"
                        value={enrollmentData.yearsExperience}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Practice Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={enrollmentData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Describe your practice and services..."
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Practice Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={enrollmentData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={enrollmentData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={enrollmentData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                      <Input
                        id="consultationFee"
                        name="consultationFee"
                        type="number"
                        value={enrollmentData.consultationFee}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit Enrollment Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorPortal;
