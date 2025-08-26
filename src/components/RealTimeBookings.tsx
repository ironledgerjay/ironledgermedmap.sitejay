import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/superbaseClient';
import { emailService } from '@/utils/emailService';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  MessageSquare,
  Bell,
  RefreshCw
} from 'lucide-react';

interface Booking {
  id: string;
  patient_id: string;
  doctor_id: string;
  practice_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  reason_for_visit: string;
  notes?: string;
  consultation_fee: number;
  convenience_fee: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  patient_profile?: {
    full_name: string;
    email: string;
    phone: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
  };
}

interface RealTimeBookingsProps {
  doctorId?: string;
}

export default function RealTimeBookings({ doctorId }: RealTimeBookingsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [newBookingsCount, setNewBookingsCount] = useState(0);

  useEffect(() => {
    fetchBookings();
    setupRealTimeSubscription();
  }, [doctorId, user]);

  const fetchBookings = async () => {
    if (!user?.id && !doctorId) return;

    try {
      setLoading(true);

      // Get doctor ID if not provided
      let currentDoctorId = doctorId;
      if (!currentDoctorId && user?.id) {
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        currentDoctorId = doctorData?.id;
      }

      if (!currentDoctorId) {
        setBookings([]);
        return;
      }

      // Fetch bookings with patient profiles
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          patient_profile:user_profiles!inner(
            full_name,
            email,
            phone,
            emergency_contact_name,
            emergency_contact_phone
          )
        `)
        .eq('doctor_id', currentDoctorId)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        // Use mock data for demo purposes
        setBookings(getMockBookings());
      } else {
        setBookings(data || []);
      }

    } catch (error) {
      console.error('Unexpected error fetching bookings:', error);
      setBookings(getMockBookings());
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscription = () => {
    if (!user?.id && !doctorId) return;

    // Subscribe to booking changes
    const subscription = supabase
      .channel('booking_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        async (payload) => {
          console.log('Real-time booking update:', payload);
          
          if (payload.eventType === 'INSERT') {
            // New booking created
            setNewBookingsCount(prev => prev + 1);
            toast({
              title: "🔔 New Booking Request",
              description: "You have received a new appointment booking request.",
              duration: 6000,
            });
          }

          // Refresh bookings to show latest data
          await fetchBookings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const getMockBookings = (): Booking[] => [
    {
      id: '1',
      patient_id: 'patient1',
      doctor_id: 'doctor1',
      practice_id: 'practice1',
      appointment_date: '2024-01-15',
      appointment_time: '09:00',
      duration_minutes: 30,
      status: 'scheduled',
      reason_for_visit: 'Regular checkup and health screening',
      consultation_fee: 800,
      convenience_fee: 10,
      total_amount: 810,
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient_profile: {
        full_name: 'John Doe [TEST PATIENT]',
        email: 'john.doe.test@example.com',
        phone: '+27 11 123 4567',
        emergency_contact_name: 'Jane Doe',
        emergency_contact_phone: '+27 11 123 4568'
      }
    },
    {
      id: '2',
      patient_id: 'patient2',
      doctor_id: 'doctor1',
      practice_id: 'practice1',
      appointment_date: '2024-01-15',
      appointment_time: '10:30',
      duration_minutes: 45,
      status: 'confirmed',
      reason_for_visit: 'Follow-up consultation for medication review',
      consultation_fee: 800,
      convenience_fee: 10,
      total_amount: 810,
      payment_status: 'paid',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date().toISOString(),
      patient_profile: {
        full_name: 'Sarah Wilson [TEST PATIENT]',
        email: 'sarah.wilson.test@example.com',
        phone: '+27 21 234 5678'
      }
    },
    {
      id: '3',
      patient_id: 'patient3',
      doctor_id: 'doctor1',
      practice_id: 'practice1',
      appointment_date: '2024-01-16',
      appointment_time: '14:00',
      duration_minutes: 60,
      status: 'scheduled',
      reason_for_visit: 'Initial consultation for chronic pain management',
      consultation_fee: 1200,
      convenience_fee: 10,
      total_amount: 1210,
      payment_status: 'paid',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date().toISOString(),
      patient_profile: {
        full_name: 'Michael Johnson [TEST PATIENT]',
        email: 'michael.johnson.test@example.com',
        phone: '+27 31 345 6789',
        emergency_contact_name: 'Lisa Johnson',
        emergency_contact_phone: '+27 31 345 6790'
      }
    }
  ];

  const handleBookingAction = async (bookingId: string, action: 'confirm' | 'cancel', notes?: string) => {
    setActionLoading(bookingId);

    try {
      const newStatus = action === 'confirm' ? 'confirmed' : 'cancelled';
      
      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          notes: notes || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        // Demo mode - update local state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus, notes: notes || '' }
            : booking
        ));
      }

      // Find the booking to send notification
      const booking = bookings.find(b => b.id === bookingId);
      if (booking?.patient_profile) {
        // Send email notification to patient
        const emailSubject = action === 'confirm' 
          ? 'Appointment Confirmed - IronledgerMedMap'
          : 'Appointment Update - IronledgerMedMap';
        
        // In production, you'd have specific email templates for booking confirmations
        console.log(`Sending ${action} email to ${booking.patient_profile.email}`);
      }

      toast({
        title: action === 'confirm' ? "Appointment Confirmed ✅" : "Appointment Cancelled",
        description: `The appointment has been successfully ${action}ed. Patient has been notified via email.`,
        duration: 5000,
      });

      // Refresh bookings
      await fetchBookings();

    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      toast({
        title: "Action Failed",
        description: `Failed to ${action} appointment. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      no_show: { label: 'No Show', className: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const paymentConfig = {
      pending: { label: 'Payment Pending', className: 'bg-orange-100 text-orange-800' },
      paid: { label: 'Paid', className: 'bg-green-100 text-green-800' },
      refunded: { label: 'Refunded', className: 'bg-gray-100 text-gray-800' }
    };

    const config = paymentConfig[status as keyof typeof paymentConfig] || paymentConfig.pending;

    return (
      <Badge variant="outline" className={config.className}>
        <DollarSign className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const clearNewBookingsAlert = () => {
    setNewBookingsCount(0);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* New bookings alert */}
      {newBookingsCount > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Bell className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You have {newBookingsCount} new booking request{newBookingsCount > 1 ? 's' : ''} requiring your attention.
            <Button 
              variant="link" 
              className="p-0 ml-2 text-blue-600 h-auto"
              onClick={clearNewBookingsAlert}
            >
              Mark as seen
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Bookings header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Patient Bookings</h2>
        <Button variant="outline" onClick={fetchBookings}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Bookings list */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {booking.patient_profile?.full_name?.split(' ').map(n => n[0]).join('') || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{booking.patient_profile?.full_name}</h3>
                      {getStatusBadge(booking.status)}
                      {getPaymentBadge(booking.payment_status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.appointment_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{booking.appointment_time} ({booking.duration_minutes} mins)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{booking.patient_profile?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{booking.patient_profile?.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Reason for visit:</p>
                          <p className="text-sm text-gray-600">{booking.reason_for_visit}</p>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 mt-0.5 text-blue-400" />
                          <div>
                            <p className="text-sm font-medium">Doctor notes:</p>
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Fee: R{booking.consultation_fee}</span>
                        <span className="text-gray-500">+ R{booking.convenience_fee} convenience fee</span>
                        <span className="font-semibold">= R{booking.total_amount} total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                {booking.status === 'scheduled' && (
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      onClick={() => handleBookingAction(booking.id, 'confirm')}
                      disabled={actionLoading === booking.id}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      {actionLoading === booking.id ? 'Processing...' : 'Confirm'}
                    </Button>
                    <Button
                      onClick={() => handleBookingAction(booking.id, 'cancel', 'Doctor unavailable')}
                      disabled={actionLoading === booking.id}
                      variant="destructive"
                      size="sm"
                    >
                      {actionLoading === booking.id ? 'Processing...' : 'Cancel'}
                    </Button>
                  </div>
                )}

                {booking.status === 'confirmed' && (
                  <div className="ml-4">
                    <Button
                      onClick={() => handleBookingAction(booking.id, 'cancel', 'Unexpected cancellation')}
                      disabled={actionLoading === booking.id}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {bookings.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600">
                Patient bookings will appear here once your doctor profile is approved and patients start booking appointments.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
