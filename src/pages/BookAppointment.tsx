import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, Phone, Mail, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import HomeButton from "@/components/HomeButton";
import { usePayment } from "@/hooks/usePayment";
import { supabase } from "../superbaseClient";
import { useToast } from "@/hooks/use-toast";

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor_id');
  
  const [doctor, setDoctor] = useState<any>(null);
  const [practice, setPractice] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reasonForVisit: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { processBookingPayment, isProcessing } = usePayment();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to book an appointment",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      setCurrentUser(user);

      // Load user membership
      const { data: membershipData } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setMembership(membershipData);

      if (doctorId) {
        // Load doctor information
        const { data: doctorData } = await supabase
          .from('doctors')
          .select(`
            *,
            user_profiles (full_name, email, phone),
            medical_practices (*)
          `)
          .eq('id', doctorId)
          .single();

        if (doctorData) {
          setDoctor(doctorData);
          setPractice(doctorData.medical_practices);
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [doctorId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getBookingCost = () => {
    const consultationFee = doctor?.consultation_fee || 300;
    const hasFreeBookings = membership?.membership_type === 'premium' && membership?.bookings_remaining > 0;
    const convenienceFee = hasFreeBookings ? 0 : 10;
    
    return {
      consultationFee,
      convenienceFee,
      total: consultationFee + convenienceFee,
      hasFreeBookings
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !doctor) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          patient_id: currentUser.id,
          doctor_id: doctor.id,
          practice_id: practice?.id,
          appointment_date: bookingData.appointmentDate,
          appointment_time: bookingData.appointmentTime,
          reason_for_visit: bookingData.reasonForVisit,
          notes: bookingData.notes,
          consultation_fee: doctor.consultation_fee,
          convenience_fee: getBookingCost().convenienceFee,
          status: 'scheduled',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Process payment
      const paymentResult = await processBookingPayment(
        booking.id,
        getBookingCost().total,
        getBookingCost().hasFreeBookings
      );

      if (paymentResult.success) {
        toast({
          title: "Appointment booked!",
          description: "Your appointment has been successfully booked and confirmed."
        });
        navigate('/');
      } else {
        // Delete the booking if payment failed
        await supabase.from('bookings').delete().eq('id', booking.id);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-lg">Loading appointment details...</div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-lg">Doctor not found</div>
          <Button onClick={() => navigate('/')} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const costs = getBookingCost();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
            <p className="text-muted-foreground">Schedule your consultation with {doctor.user_profiles?.full_name}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Doctor Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Doctor Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.user_profiles?.full_name}</h3>
                    <p className="text-muted-foreground">{doctor.specialty}</p>
                    <Badge className="mt-2">
                      {doctor.years_of_experience} years experience
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>{doctor.user_profiles?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.user_profiles?.phone}</span>
                    </div>
                    {practice && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{practice.address}</span>
                      </div>
                    )}
                  </div>

                  {doctor.bio && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">About</h4>
                        <p className="text-sm text-muted-foreground">{doctor.bio}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Cost Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Consultation Fee</span>
                    <span>R{costs.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Convenience Fee</span>
                    <span>{costs.convenienceFee === 0 ? 'FREE' : `R${costs.convenienceFee}`}</span>
                  </div>
                  {costs.hasFreeBookings && (
                    <div className="text-sm text-green-600">
                      ✓ Using premium membership free booking
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>R{costs.total}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Appointment</CardTitle>
                <CardDescription>Choose your preferred date and time</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="appointmentDate">
                        <Calendar className="h-4 w-4 inline mr-2" />
                        Date
                      </Label>
                      <Input
                        id="appointmentDate"
                        name="appointmentDate"
                        type="date"
                        value={bookingData.appointmentDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointmentTime">
                        <Clock className="h-4 w-4 inline mr-2" />
                        Time
                      </Label>
                      <Select onValueChange={(value) => handleSelectChange('appointmentTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">09:00 AM</SelectItem>
                          <SelectItem value="09:30">09:30 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="10:30">10:30 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="11:30">11:30 AM</SelectItem>
                          <SelectItem value="14:00">02:00 PM</SelectItem>
                          <SelectItem value="14:30">02:30 PM</SelectItem>
                          <SelectItem value="15:00">03:00 PM</SelectItem>
                          <SelectItem value="15:30">03:30 PM</SelectItem>
                          <SelectItem value="16:00">04:00 PM</SelectItem>
                          <SelectItem value="16:30">04:30 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reasonForVisit">Reason for Visit</Label>
                    <Input
                      id="reasonForVisit"
                      name="reasonForVisit"
                      value={bookingData.reasonForVisit}
                      onChange={handleInputChange}
                      placeholder="e.g., General checkup, follow-up consultation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={bookingData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional information for the doctor..."
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? 'Processing Payment...' : `Book Appointment - R${costs.total}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
